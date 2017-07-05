const async = require('async');
const Model = require('../model');

let run = (callback) => {
    Model.card.find({}, (err, cards) => {
        if (err) return callback(err);

        async.each(cards, (card, next) => {
            card.save(next);
        }, callback);
    });
}

run((err) => {
    if (err) console.log(err);
    console.log('done.');
    process.exit();
});
