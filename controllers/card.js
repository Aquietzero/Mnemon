var _ = require('lodash');
var async = require('async');
var Model = require('../model');

module.exports = function (app) {
    return {
        all: function (req, res) {
            console.log(req.body);

            var defaultQ = {q: {}, limit: 20, page: 0};
            var query = _.extend(defaultQ, req.body.query || {});

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

        detail: (req, res) => {
            let title = req.body.title;
            if (!title) {
                return res.send({message: 'failed', error: 'lack of arguments.'});
            }

            Model.card.findOne({title: title}, (err, card) => {
                if (err) return res.send({message: 'failed', error: err});

                return res.send({
                    message: 'ok',
                    data: card
                });
            });
        },

        remove: (req, res) => {
            let title = req.body.title;
            let deck = req.body.deck;

            if (!title || !deck) return res.send({message: 'failed', error: 'lack of arguments.'});

            async.series([
                (next) => {
                    Model.card.findOne({deck: deck, title: title}, (err, card) => {
                        if (err || !card) return next(err || 'card does not exist.');

                        card.remove((err) => {return next()});
                    });
                },
                (next) => {
                    Model.deck.findOne({name: deck}, (err, deck) => {
                        deck.number_of_cards -= 1;
                        deck.save(next);
                    });
                }
            ], (err) => {
                if (err) return res.send({message: 'failed', error: err});
                res.send({message: 'ok'});
            });
        },

        update: function (req, res) {
            var title = req.body.title;

            console.log(req.body);

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
                    },
                    function (next) {
                        Model.mnemon.reviewNewCard(newCard, next);
                    },
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
