var _ = require('lodash');
var async = require('async');
var Model = require('../model');

module.exports = function (app) {
    return {
        home: function (req, res) {
            res.render('index', {title: 'Mnemon'});
        }
    }
}
