var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Model = require('../model');
var async = require('async');

var run = function (callback) {
    var sentences = [];
    async.series([
        function (next) {
            Model.card.find({}, function (err, cards) {
                _.each(cards, function (card) {
                    sentences = _.union(sentences, card.sentences());
                });
                next();
            });
        },
        function (next) {
            var filename = path.join(__dirname, '../data/sentences');
            fs.writeFileSync(filename, sentences.join('\n'));
            next();
        }
    ], callback);
}

run(function (err) {
    if (err) console.log(err);
    console.log('done.');
    process.exit();
});
