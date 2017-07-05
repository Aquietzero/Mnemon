var _ = require('lodash');
var async = require('async');
var mnemonDb = require('../model').mnemonDb;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = require('../model');

var periods = require('../constants/periods');

// Review log keeps track of the review process of each user of each deck.
var ReviewLogSchema = new Schema({
    card: {
        type: String,
        index: true,
        require: true,
    },
    user: {
        type: String,
        index: true,
        require: true,
    },
    deck: {
        type: String,
        index: true,
        require: true,
    },
    box: {
        type: String,
        index: true,
        require: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

module.exports = mnemonDb.model('ReviewLog', ReviewLogSchema, 'review_log');
