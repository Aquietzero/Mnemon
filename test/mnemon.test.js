var _ = require('lodash');
var async = require('async');
var Model = require('../model');

var decks = [{
    name: 'deck1',
    user: 'zero',
}, {
    name: 'deck2',
    user: 'zero',
}];

var cards = [{
    title: 'card1',
    explain: 'card1',
    content: 'card1',
    deck: 'deck1',
}, {
    title: 'card2',
    explain: 'card2',
    content: 'card2',
    deck: 'deck1',
}, {
    title: 'card3',
    explain: 'card3',
    content: 'card3',
    deck: 'deck1',
}];

var setup = (callback) => {
    async.series([
        (next) => {
            async.map(decks, (d, cb) => {
                (new Model.deck(d)).save(cb);
            }, next);
        },
        (next) => {
            async.map(cards, (c, cb) => {
                (new Model.card(c)).save(cb);
            }, next);
        },
    ], callback);
}

var clean = (callback) => {
    var collections = ['card', 'deck', 'mnemon'];

    async.map(collections, (c, next) => {
        Model[c].remove({}, (err) => {
            next();
        });
    }, callback);
}



describe('Test for mnemon card memorization flow.', () => {
    beforeEach((done) => {
        async.series([clean, setup], done);
    });
    afterEach(clean);

    describe('Mnemon#reviewDeck', () => {
        it('should be able to create mnemons for cards in a given deck.', (done) => {
            Model.mnemon.reviewDeck('zero', 'deck1', (err) => {
                Model.mnemon.find({}, (err, mnemons) => {
                    mnemons.length.should.equal(cards.length);
                    _.uniq(_.map(mnemons, 'deck'))[0].should.equal('deck1');
                    done();
                });
            });
        });
    });

    describe('Mnemon#pick', () => {
        beforeEach((done) => {
            async.series([
                (next) => {
                    Model.mnemon.reviewDeck('zero', 'deck1', next);
                },
                (next) => {
                    var updated_at = new Date();
                    updated_at.setMinutes(updated_at.getMinutes() - 2);
                    Model.mnemon.update({}, {
                        created_at: updated_at,
                        updated_at: updated_at,
                    }, {multi: true}, next);
                },
            ], done);
        });

        it('should be able to pick a proper number of cards', (done) => {
            Model.mnemon.pick('zero', 'deck1', 2, (err, cards) => {
                cards.length.should.equal(2);
                done();
            });
        });

        it('should be able to pick a proper number of cards', (done) => {
            Model.mnemon.pick('zero', 'deck1', 100, (err, cards) => {
                cards.length.should.equal(3);
                done();
            });
        });
    });

    describe('Mnemon#put', () => {
        beforeEach((done) => {
            async.series([
                (next) => {
                    Model.mnemon.reviewDeck('zero', 'deck1', next);
                },
                (next) => {
                    var updated_at = new Date();
                    updated_at.setMinutes(updated_at.getMinutes() - 2);
                    Model.mnemon.update({}, {
                        created_at: updated_at,
                        updated_at: updated_at,
                    }, {multi: true}, next);
                },
            ], done);
        });

        it('should be able to put a card into a proper box.', (done) => {
            Model.mnemon.put('zero', 'deck1', 'card1', true, (err, mnemon) => {
                mnemon.box.should.equal('10MIN');
                done();
            });
        });

        it('should be able to put a card into a proper box.', (done) => {
            Model.mnemon.put('zero', 'deck1', 'card1', false, (err, mnemon) => {
                mnemon.box.should.equal('1MIN');
                done();
            });
        });

        it('should be able to put a card into a proper box.', (done) => {
            async.series([
                function (next) {
                    Model.mnemon.put('zero', 'deck1', 'card1', true, (err, mnemon) => {
                        mnemon.box.should.equal('10MIN');
                        next();
                    });
                },
                function (next) {
                    Model.mnemon.put('zero', 'deck1', 'card1', false, (err, mnemon) => {
                        mnemon.box.should.equal('1MIN');
                        next();
                    });
                },
                function (next) {
                    Model.mnemon.put('zero', 'deck1', 'card1', true, next);
                },
                function (next) {
                    Model.mnemon.put('zero', 'deck1', 'card1', true, next);
                },
                function (next) {
                    Model.mnemon.put('zero', 'deck1', 'card1', true, (err, mnemon) => {
                        mnemon.box.should.equal('4D');
                        next();
                    });
                },
            ], done);
        });
    });
});

