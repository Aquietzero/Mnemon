const _ = require('lodash');
const async = require('async');
const Model = require('../model');

const periods = require('../constants/periods');

module.exports = function (app) {
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

            Model.mnemon.find({deck: deck}, (err, mnemons) => {
                if (err) return res.send({message: 'failed', error: err});

                if (mnemons.length == 0) return res.send({message: 'ok', data: {setup: false, stats: {}}});

                let stats = [];
                let count = _.countBy(mnemons, 'box');

                // Using array to maintain order.
                _.each(periods, (p) => {
                    stats.push({
                        display: p.display,
                        percent: Math.floor(100*(count[p.name] || 0) / mnemons.length),
                    });
                });

                res.send({
                    message: 'ok',
                    data: {
                        setup: true,
                        stats
                    },
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
