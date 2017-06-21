var _ = require('lodash');
var async = require('async');
var Model = require('../model');

module.exports = function (app) {
    return {
        all: function (req, res) {
            var defaultQ = {q: {}, limit: 20, page: 0};
            var query = _.extend(defaultQ, JSON.parse(req.body.query) || {});

            Model.card
            .find(query.q)
            .skip(query.page * query.limit)
            .limit(query.limit)
            .sort({created_at: -1})
            .exec(function (err, cards) {
                if (err) return res.send({message: 'failed', error: err});

                return res.send({
                    message: 'ok',
                    data: cards
                });
            });
        },

        detail: function (req, res) {
            var title = req.body.title;
            if (!title) {
                return res.send({message: 'failed', error: 'lack of arguments.'});
            }

            Model.card.findOne({title: title}, function (err, card) {
                if (err) return res.send({message: 'failed', error: err});

                return res.send({
                    message: 'ok',
                    data: card
                });
            });
        },

        update: function (req, res) {
            var title = req.body.title;

            if (!title) {
                return res.send({message: 'failed', error: 'lack of arguments.'});
            }

            Model.card.findOne({title: title}, function (err, card) {
                var newCard, isNew = false;

                if (card) {
                    card = _.extend(card, req.body);
                } else {
                    isNew = true;
                    card = new Model.card(req.body);
                }

                async.series([
                    function (next) {
                        card.save(function (err, _newCard) {
                            if (err) return next(err);
                            newCard = _newCard;
                            next()
                        });
                    },
                    function (next) {
                        if (!isNew) return next();

                        Model.deck.findOne({name: newCard.deck}, function (err, deck) {
                            // TODO create deck by default.
                            if (err || !deck) return next();
                            deck.number_of_cards += 1;
                            deck.save(next);
                        });
                    }
                ], function (err) {
                    if (err) return res.send({message: 'failed', error: err});

                    return res.send({
                        message: 'ok',
                        data: newCard
                    });
                });
            });
        }
    }
}
