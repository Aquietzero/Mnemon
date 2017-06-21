var _ = require('lodash');
var async = require('async');
var mnemonDb = require('../model').mnemonDb;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Model = require('../model');

var periods = require('../constants/periods');

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

// Consider how to continues add new cards into a deck review plan. Since cards
// are being created all the time.
MnemonSchema.statics.reviewDeck = (user, deck, callback) => {
    Model.card.find({deck: deck}, (err, cards) => {
        async.mapLimit(cards, 10, (card, next) => {
            let mnemon = new Model.mnemon({
                card: card.title,
                user: user,
                deck: deck,
                box: periods[0].name,
                created_at: Date.now(),
            });

            mnemon.save(next);
        }, callback);
    });
}

// Pick `n` cards from given user and deck.
MnemonSchema.statics.pick = (user, deck, n=1, callback) => {
    let cards = [];
    let getFromBox = (box) => {
        return (cb) => {
            let period = _.find(periods, {name: box});
            let timeBound = new Date(_.now() - period.seconds * 1000);

            Model.mnemon.find({
                user: user, deck: deck, box: box,
                //$updated_at: {$lt: timeBound}
            }).sort({updated_at: -1}).limit(n).exec((err, mnemons) => {
                _.each(mnemons, (m) => {
                    cards.push(m.card);
                });

                if (cards.length >= n) return cb(null, cards);
                cb();
            });
        }
    }

    let getFromBoxes = _.map(periods, (p) => {
        return getFromBox(p.name);
    });

    async.tryEach(getFromBoxes, (err, results) => {
        // Number of results is only used for break the try loop. Even though
        // there are not enough cards, the result cards should be returned.
        return callback(err, cards);
    });
}

// Put a card into the previous box if it is not remembered otherwise it goes into the next box.
MnemonSchema.statics.put = function (user, deck, card, remembered, callback) {
    this.findOne({user: user, deck: deck, card: card}, function (err, mnemon) {
        if (err || !mnemon) return callback(err || 'No mnemon.');

        var currBox = mnemon.box;
        var currIndex = _.findIndex(periods, {name: currBox});

        var prevBox = currIndex == 0 ? currBox : periods[currIndex-1].name;
        var nextBox = currIndex == periods.length - 1 ? currBox : periods[currIndex+1].name;

        var box = remembered ? nextBox : prevBox;
        mnemon.box = box;
        mnemon.save(callback);
    });
}


module.exports = mnemonDb.model('Mnemon', MnemonSchema, 'mnemons');
