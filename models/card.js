var _ = require('lodash');
var mnemonDb = require('../model').mnemonDb;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
    // every card should belong to a deck.
    deck: {
        type: String,
        default: 'default',
        index: true,
    },

    // e.g.: words, phrases, grammar points.
    title: {
        type: String,
        require: true,
        index: true,
        unique: true,
    },

    // e.g.: translation of title in different language.
    explain: {
        type: String,
        index: true,
        require: true,
    },

    sub_title: {
        type: String,
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

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

CardSchema.methods.sentences = function () {
    var title = this.title;
    var include = function (s) {
        return _.includes(s, title) &&
            !s[0].trim().match(/^\d+/g) // sentence start with number.
    }
    var format = function (s) {
        s = s.replace(/[（）]/g, '');
        return s.trim();
    }

    var sentences = _.compact(this.content.split(/[\r\n。？！?!]/g));
    sentences = _.filter(sentences, include);
    sentences = _.map(sentences, format);

    return sentences;
}


module.exports = mnemonDb.model('Card', CardSchema, 'cards');
