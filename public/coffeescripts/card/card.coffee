Backbone = require 'backbone'

class Card extends Backbone.Model
    idAttribute: '_id'

    defaults:
        deck: 'default'
        title: 'Word'
        explain: 'A basic unit to express something.'
        sub_title: 'Noun'
        content: 'Words build sentences, which build a language.'
        # tags: ['language', 'noun'],
        # connections: ['Sentence', 'Language'],
        tags: []
        connections: []
        memory_aids: 'What? It\'s a word.'

module.exports = Card

