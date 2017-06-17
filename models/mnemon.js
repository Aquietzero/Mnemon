var _ = require('lodash');
var async = require('async');
var mnemonDb = require('../model').mnemonDb;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var periods = require('../contants/periods');

// A mnemon represents the progress of memorization of a card.
var MnemonSchema = new Schema({
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
        enum: _.map(periods, 'name'),
        default: '1MIN',
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

MnemonSchema.pre('save', function (cb) {
    this.updated_at = Date.now();
    cb();
});

// Pick N cards from given user and deck.
MnemonSchema.statics.pick = function (user, deck, n, callback) {
    // Default to pick only one card.
    var n = n || 1;

    var cards = [];
    var getFromBox = function (box) {
        return function (cb) {
            var period = _.where(periods, {name: box});
            var timeBound = new Date(_.now() - period.seconds * 1000);

            this.find({
                user: user, deck: deck, box: box,
                $updated_at: {$lt: timeBound}
            }).sort({updated_at: -1}).limit(n).exec(function (err, mnemons) {
                _.each(mnemons, function (m) {
                    cards.push(m.card);
                });

                if (cards.length >= n) return cb(null, cards);
                cb();
            });
        }
    }

    var getFromBoxes = _.map(periods, function (p) {
        return getFromBox(p.name);
    });

    async.try(getFromBoxes, callback);
}


module.exports = mnemonDb.model('Card', CardSchema, 'cards');
