var _ = require('lodash');
var Model = require('../model');
var async = require('async');

var run = function (callback) {
    var decks;

    async.series([
        function (next) {
            Model.deck.find({}, function (err, _decks) {
                if (err) return next(err);

                decks = _decks;
                next();
            });
        },
        function (next) {
            async.each(decks, function (deck, cb) {
                Model.card.count({deck: deck.name}, function (err, count) {
                    deck.number_of_cards = count || 0;
                    deck.save(cb);
                });
            }, next);
        }
    ], callback);
}

run(function (err) {
    if (err) console.log(err);
    console.log('done.');
    process.exit();
});
