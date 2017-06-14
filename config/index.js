var _ = require('lodash');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
module.exports = _.extend(
    require('./node_env/base'),
    require('./node_env/' + process.env.NODE_ENV) || {});
