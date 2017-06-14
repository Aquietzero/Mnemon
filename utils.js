var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var utils = module.exports = {};

var load = function (filepath, name, app) {
    var func = function () {
        return name ? require(filepath + name) : require(filepath);
    }

    return app && func()(app) || func();
}

utils.loadDir = function (dir, app) {
    var patcher = {};

    _.each(fs.readdirSync(path.join(__dirname, dir)), function (filename) {
        if (!/\.js$/.test(filename)) return;

        var name = path.basename(filename, '.js');
        var _load = load.bind(null, './' + dir + '/', name, app);

        patcher.__defineGetter__(name, _load);
    });

    return patcher;
}

// shA: 600, 601, 603 沪市A股
// shB: 900 沪市B股
// szA: 000 深圳A股
// szB: 200 深圳B股
// zxb: 002 中小板
// cyb: 300 创业板
utils.determineMarket = function (code) {
    var shRe = /600+|601+|603+/g;
    var szRe = /000+|200+/g;
    var zxbRe = /002+/g;
    var cybRe = /300+/g;

    if (code.match(shRe)) return 'sh';
    if (code.match(szRe)) return 'sz';
    if (code.match(zxbRe)) return 'zxb';
    if (code.match(cybRe)) return 'cyb';

    return;
}

