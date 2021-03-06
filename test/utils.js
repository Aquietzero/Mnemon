const async = require('async');
const Model = require('../model');

let utils = module.exports = {}

utils.clean = (callback) => {
    var collections = ['card', 'deck', 'mnemon', 'review_log'];

    async.map(collections, (c, next) => {
        Model[c].remove({}, (err) => {
            next();
        });
    }, callback);
}

