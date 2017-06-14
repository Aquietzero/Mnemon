var _ = require('lodash');
var async = require('async');
var Model = require('../model');

module.exports = function (app) {
    return {
        detail: function (req, res) {
            var title = req.body.title;
            if (!title) {
                return res.send({
                    message: 'failed',
                    error: 'lack of arguments.'
                });
            }

            Model.card.findOne({title: title}, function (err, card) {
                if (err) return res.send({message: 'failed', error: err});

                return res.send({
                    message: 'ok',
                    data: card
                });
            });
        },

        create: function (req, res) {
            var card = new Model.card(req.body);
            card.save(function (err, newCard) {
                if (err) return res.send({message: 'failed', error: err});

                return res.send({
                    message: 'ok',
                    data: newCard
                });
            });
        }
    }
}
