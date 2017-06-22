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

                let stats = _.countBy(mnemons, 'box');

                _.each(_.map(periods, 'name'), (p) => {
                    stats[p] = stats[p] || 0;
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
            console.log(req.body);

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
    }
}
