var _ = require('lodash');
var mnemonDb = require('../model').mnemonDb;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
    // e.g.: words, phrases, grammar points.
    title: {
        type: String,
        require: true,
        index: true,
        unique: true,
    },

    // e.g.: translation of title in different language.
    sub_title: {
        type: String,
        index: true,
        require: true,
    },

    // Supports markdown.
    content: {
        type: String,
        require: true,
    },

    tags: [String],

    // connection to other words, phrases or grammar points.
    connections: [String],

    // a string given some memory aids.
    memory_aids: String,
});

module.exports = mnemonDb.model('Card', CardSchema, 'cards');
