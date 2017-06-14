var mongoose = require('mongoose');
var config = require('./config')
var loadDir = require('./utils').loadDir;

exports = module.exports = loadDir('models');

var mnemonDb = mongoose.createConnection(config.db.mnemon.name, config.db.mnemon.opts);
exports.mnemonDb = mnemonDb;

