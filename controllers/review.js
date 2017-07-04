const _ = require('lodash');
const async = require('async');
const moment = require('moment');
const Model = require('../model');

const periods = require('../constants/periods');

module.exports = (app) => {
    return {
        setup: (req, res) => {
            let deck = req.params.deck;
            if (!deck) return res.send({message: 'failed', error: 'lack of arguments.'});

            let user = 'zero';
            Model.mnemon.reviewDeck(user, deck, (err) => {
                if (err) return res.send({message: 'failed', error: err});

                res.send({message: 'ok'});
            });
        },

        statistics: (req, res) => {
            let deck = req.params.deck;
            if (!deck) return res.send({message: 'failed', error: 'lack of arguments.'});

            // `setup` denotes whether the review flow is setup or not.
            let data = {setup: false, deck: null, stats: []};

            async.series([
                function (next) {
                    Model.deck.findOne({name: deck}, function (err, deck) {
                        if (err || !deck) return next(err || 'deck does not exist.');

                        data.deck = deck.toJSON();
                        data.deck.updated_at = moment(deck.updated_at).format('YYYY-MM-DD');
                        data.deck.created_at = moment(deck.updated_at).format('YYYY-MM-DD');
                        next();
                    });
                },
                function (next) {
                    Model.mnemon.find({deck: deck}, (err, mnemons) => {
                        if (err) return next(err);

                        if (mnemons.length == 0) return next();

                        let count = _.countBy(mnemons, 'box');
                        data.setup = true;
                        // Using array to maintain order.
                        _.each(periods, (p) => {
                            data.stats.push({
                                display: p.display + '(' + p.explain + ')',
                                percent: Math.floor(100*(count[p.name] || 0) / mnemons.length),
                            });
                        });

                        next();
                    });
                }
            ], function (err) {
                if (err) return res.send({message: 'failed', error: err});
                res.send({
                    message: 'ok',
                    data: data,
                });
            });
        },

        pick: (req, res) => {
            let deck = req.body.deck;
            let n = parseInt(req.body.n || 20);
            let user = 'zero';

            if (!deck) return res.send({message: 'failed', error: 'lack of arguments.'});

            Model.mnemon.pick(user, deck, n, (err, cardTitles) => {
                Model.card.find({title: {$in: cardTitles}}, function (err, cards) {
                    if (err) return res.send({message: 'failed', error: err});
                    res.send({message: 'ok', data: cards});
                });
            });
        },

        put: (req, res) => {
            let deck = req.body.deck;
            let card = req.body.card;
            let user = 'zero';
            let remembered = req.body.remembered || false;

            if (!deck || !card || !user) {
                return res.send({message: 'failed', error: 'lack of arguments.'});
            }

            Model.mnemon.put(user, deck, card, remembered, (err) => {
                if (err) return res.send({message: 'failed', error: err});
                res.send({message: 'ok'});
            });
        },
    }
}
