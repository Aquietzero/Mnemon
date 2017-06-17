Backbone = require 'backbone'

class Card extends Backbone.Model
    defaults:
        deck: 'default'
        title: 'Word'
        sub_title: 'A basic unit to express something.'
        content: 'Words build sentences, which build a language.'
        # tags: ['language', 'noun'],
        # connections: ['Sentence', 'Language'],
        tags: []
        connections: []
        memory_aids: 'What? It\'s a word.'

module.exports = Card

