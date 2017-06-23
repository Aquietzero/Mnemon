var _ = require('lodash');
var async = require('async');
var Model = require('../model');

module.exports = function (app) {
    return {
        all: function (req, res) {
            var defaultQ = {q: {}, limit: 20, skip: 0};
            var query = _.extend(defaultQ, req.body.query || {});

            Model.deck
            .find(query.q)
            .skip(query.skip)
            .limit(query.limit)
            .sort({_id: -1})
            .exec(function (err, decks) {
                if (err) return res.send({message: 'failed', error: err});

                return res.send({
                    message: 'ok',
                    data: decks
                });
            });
        },

        update: function (req, res) {
            var name = req.body.name;

            if (!name) {
                return res.send({message: 'failed', error: 'lack of arguments.'});
            }

            Model.deck.findOne({name: name}, function (err, deck) {
                if (deck) {
                    deck = _.extend(deck, req.body);
                } else {
                    deck = new Model.deck(req.body);
                }

                deck.save(function (err, newDeck) {
                    if (err) return res.send({message: 'failed', error: err});

                    return res.send({
                        message: 'ok',
                        data: newDeck
                    });
                });
            });
        }
    }
}
