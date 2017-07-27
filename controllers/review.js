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

            let user = req.session.user.name;
            Model.mnemon.reviewDeck(user, deck, (err) => {
                if (err) return res.send({message: 'failed', error: err});

                res.send({message: 'ok'});
            });
        },

        statistics: (req, res) => {
            let deck = req.params.deck;
            let user = req.session.user.name;
            if (!deck || !user) return res.send({message: 'failed', error: 'lack of arguments.'});

            // `setup` denotes whether the review flow is setup or not.
            let data = {setup: false, deck: null, stats: []};

            async.series([
                (next) => {
                    Model.deck.findOne({name: deck}, (err, deck) => {
                        if (err || !deck) return next(err || 'deck does not exist.');

                        data.deck = deck.toJSON();
                        data.deck.updated_at = moment(deck.updated_at).format('YYYY-MM-DD');
                        data.deck.created_at = moment(deck.updated_at).format('YYYY-MM-DD');
                        next();
                    });
                },
                (next) => {
                    Model.mnemon.find({deck: deck, user: user}, (err, mnemons) => {
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
            ], (err) => {
                if (err) return res.send({message: 'failed', error: err});
                res.send({
                    message: 'ok',
                    data: data,
                });
            });
        },

        // Review efficiency is defined by a rate: number of cards / number of reviews.
        // The more the efficiency close to 1, the more efficient the review is.
        efficiency: (req, res) => {
            let deck = req.params.deck;
            let range = 10;
            let today = new Date();
            let from = new Date();
            from.setDate(today.getDate() - range);
            let data = [];

            Model.review_log.find({deck: deck, created_at: {$gt: from}}, (err, logs) => {
                if (err) return res.send({message: 'failed', error: err});

                let byDate = _.groupBy(logs, (l) => {
                    return moment(l.created_at).format('YYYY-MM-DD');
                });

                let efficiencyByDate = {};
                _.each(byDate, (logs, date) => {
                    efficiency = _.uniqBy(logs, 'card').length / logs.length;
                    efficiencyByDate[date] = efficiency;
                });

                let formatDate;
                for (let d = from; d <= today; d.setDate(d.getDate() + 1)) {
                    formatDate = moment(d).format('YYYY-MM-DD');
                    data.push([(new Date(formatDate)).valueOf(), efficiencyByDate[formatDate] || 0]);
                }

                res.send({
                    message: 'ok',
                    data: data,
                });
            });
        },

        boxDistribution: (req, res) => {
            let range = 10;
            let today = new Date();
            let from = new Date();
            from.setDate(today.getDate() - range);
            let data = [];

            Model.review_log.find({created_at: {$gt: from}}, (err, logs) => {
                if (err) return res.send({message: 'failed', error: err});

                let dates = [];
                for (let d = from; d <= today; d.setDate(d.getDate() + 1)) {
                    dates.push(moment(d).format('YYYY-MM-DD'));
                }

                let byDate = _.groupBy(logs, (l) => {
                    return moment(l.created_at).format('YYYY-MM-DD');
                });

                let efficiencyByDate = {};
                _.each(byDate, (logs, date) => {
                    efficiencyByDate[date] = _.countBy(logs, 'box');
                });

                let series = [];
                _.eachRight(periods, (p) => {
                    series.push({
                        name: p.display,
                        data: _.map(dates, (date) => {
                            return [(new Date(date)).valueOf(), efficiencyByDate[date] && efficiencyByDate[date][p.name] || 0];
                        })
                    });
                });

                res.send({
                    message: 'ok',
                    data: series,
                });
            });
        },

        pick: (req, res) => {
            let deck = req.body.deck;
            let n = parseInt(req.body.n || 20);
            let user = req.session.user.name;

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
            let user = req.session.user.name;
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
