
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var async = require('async');
var crypto = require('crypto');
var moment = require('moment');
var Model = require('../../model');

var defaultLoginTemplate = fs.readFileSync(path.join(__dirname, 'login.html'), 'utf-8');


var ACL = module.exports = function (app, config) {
    var config = _.extend({
        sessionSecret: 'valar morghulis',
        secret: 'valar dohaeris',
        expiration: 1000 * 60 * 60 * 24 * 30,
        cookieName: 'mnemon-cookie'
    }, config || {});

    ACL.loginTemplateFile = config.loginTemplateFile;
    ACL.loginTemplate = _.template(defaultLoginTemplate)({title: 'Mnemon'});

    this.set('app', app);
    this.set('config', config);
    this.set('whiteList', _.extend(ACL.defaultWhiteList, config.whiteList));
    this.set('headersKey', 'valar dohaeris');

    // Add new type handler or overwrite existing ones.
    if (config.accessors) {
        _.each(config.accessors, function (handler, type) {
            this.accessors[type] = handler.bind(this);
        }, this);
    }

    this.initAccessors();
}

// Set ACL attributes.
ACL.prototype.set = function (key, val) {
    this[key] = val;
}

// Get ACL attributes.
ACL.prototype.get = function (key) {
    return this[key] || null;
}

ACL.defaultWhiteList = [
    /login/,
    /logout/,
    /public/,
    /socket.io/,
]

// Encrypt user information string.
ACL.prototype.encryptUser = function (str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

// Decrypt user information string.
ACL.prototype.decryptUser = function (str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// Generate session cookie with encrypted user information.
ACL.prototype.genSessionCookie = function (user, res) {
    var authToken = this.encryptUser([user._id, user.email, user.passwd, user.updated_at].join('\t'), this.get('config').secret);
    res.cookie(this.get('config').cookieName, authToken, {path: '/', maxAge: this.get('config').expiration});
}

ACL.prototype.md5 = function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

// Generate random password with given length.
ACL.prototype.randomPassword = function (len) {
    var len = len || 15;
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var pass = '';
    for (var i = 0; i < len; ++i) {
        pass += letters[Math.floor(Math.random() * letters.length)];
    }

    return pass;
}

// Add an ACL rule and a given preset handler.
ACL.prototype.add = function (regexes, type) {
    // Ignore all access control in test environment.
    if (!this.get('app') || this.get('app').get('env') == 'test') {
        return;
    }

    var self = this;

    // Let the middlewear below to handle the matching route rather
    // than the default login.
    this.whiteList = _.union(this.whiteList, regexes);

    this.get('app').use(function (req, res, next) {
        var isMatch = false;
        _.each(regexes, function (regex) {
            if (req.path.match(regex)) {
                isMatch = true;
            }
        });

        if (isMatch) {
            return self.accessors[type]()(req, res, next);
        }
        next();
    });
}

ACL.prototype.authUser = function () {
    return function (req, res, next) {
        if (req.session.user) {
            res.locals.user = req.session.user;
            return next();
        }

        var cookie = req.cookies[this.get('config').cookieName];
        if (!cookie) {
            res.locals.user = null;
            return next();
        }

        var authToken = this.decryptUser(cookie, this.get('config').secret);
        var auth = authToken.split('\t');
        var userId = auth[0];

        Model.user.findOne({_id: userId}, function (err, user) {
            if (user) {
                req.session.user = user;
                res.locals.user = user;
            }
            return next();
        });
    }.bind(this);
}

// A set of defualt accessors (middlewears).
ACL.prototype.isPass = function (req/* , res */) {
    var signature = req.headers['x-momoso-forwarded-for'];
    if (!signature) { return false; }
    var toDay = moment.utc().format('YYYY-MM-DD');

    if (signature.split('^_^').length === 2) {
        toDay = signature.split('^_^')[0];
        signature = signature.split('^_^')[1];
    }

    var hash_signature = crypto.createHmac('sha1', this.headersKey).update(toDay).digest('hex');
    return hash_signature === signature ? true : false;
}

ACL.prototype.accessors = {
    login: function (req, res, next) {
        var isAllow = _.some(this.get('whiteList'), function (regex) {
            return req.path.match(regex);
        }) || this.isPass(req);

        if (isAllow) {
            return next();
        }

        if (!req.session.user) {
            return res.redirect('/login');
        }

        return next();
    },

    admin: function (req, res, next) {
        if (!req.session.user || req.session.user.type != 'admin') {
            return res.redirect('/');
        }
        return next();
    },

    secret: function (req, res, next) {
        if (!this.checkSecret(req)) {
            return res.redirect('/');
        }
        return next();
    },

    pass: function (req, res, next) {
        return next();
    }
};

ACL.prototype.checkSecret = function (req) {
    return true;
}

ACL.prototype.initAccessors = function () {
    var self = this;
    _.each(this.accessors, function (accessor, type) {
        self.accessors[type] = function () {
            return accessor.bind(self);
        }
    });
}

ACL.prototype.initRouter = function () {
    var app = this.get('app');
    var self = this;

    app.get('/login', function (req, res) {
        if (ACL.loginTemplateFile) {
            return res.render(ACL.loginTemplateFile);
        } else {
            return res.send(ACL.loginTemplate);
        }
    });

    app.post('/login', function (req, res) {
        var name = req.body.username;
        var passwd = req.body.password;

        if (!name && !passwd) {
            return res.send(ACL.loginTemplate);
            //return res.send({message: 'Failed', error: 'Lack of arguments.'});
        }

        async.waterfall([
            function (next) {
                Model.user.findOne({name: name, passwd: self.md5(passwd)}, next);
            },
            function (user, next) {
                if (!user) {
                    return res.send(ACL.loginTemplate);
                    //return next('User name or password not exists.');
                }

                self.genSessionCookie(user, res);
                req.session.user = user;
                next();
            }
        ], function (err, data) {
            if (err) {
                return res.send(ACL.loginTemplate);
                //return res.send({message: 'Failed', error: err});
            }
            res.redirect('/');
        });
    });

    app.get('/logout', function (req, res) {
        req.session.destroy();
        res.clearCookie(self.get('config').cookieName, {path: '/'});
        res.redirect('/');
    });
}

ACL.prototype.addUser = function (name, password, callback) {
    var password = password || this.randomPassword();
    var newUser = Model.user({
        name: name,
        real_name: name,
        passwd: this.md5(password)
    });
    var callback = callback || function () {};

    Model.user.findOne({name: name}, function (err, user) {
        if (user) {
            console.log('User ' + user.name + ' exists.');
            return callback();
        }

        newUser.save(function (err, user) {
            if (err) {
                return callback(err);
            }

            console.log('User ' + user.name + ' has been created successfully');
            console.log('Password is ' + password);
            callback(null, user);
        });
    });
}

ACL.prototype.updateUser = function (nameType, callback) {
    var name = nameType.split('-')[0];
    var type = nameType.split('-')[1];

    Model.user.findOne({name: name}, function (err, user) {
        if (!user) {
            console.log('User ' + user.name + ' does not exist.');
            return callback();
        }

        if (_.indexOf(Model.user.types(), type) < 0) {
            console.log('Invalide user type: ' + type);
            return callback();
        }

        user.type = type;
        user.save(function (err, user) {
            if (err) {
                return callback(err);
            }

            console.log('User ' + user.name + ' has been updated to ' + type + ' successfully.');
            callback(null, user);
        });
    });
}
