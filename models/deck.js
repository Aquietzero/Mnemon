var _ = require('lodash');
var mnemonDb = require('../model').mnemonDb;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeckSchema = new Schema({
    // every card should belong to a deck.
    name: {
        type: String,
        default: 'default',
        index: true,
        unique: true,
    },

    description: String,

    user: {
        type: String,
        default: 'zero',
    },

    number_of_cards: {
        type: Number,
        default: 0,
    },

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});


module.exports = mnemonDb.model('Deck', DeckSchema, 'decks');
