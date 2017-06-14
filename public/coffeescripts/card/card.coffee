_ = require 'underscore'
Backbone = require 'backbone'
require './card.css'

template = require './card.ejs'

class CardModel extends Backbone.Model
    defaults:
        title: 'Word'
        sub_title: 'A basic unit to express something.'
        content: 'Words build sentences, which build a language.'
        tags: ['language', 'noun'],
        connections: ['Sentence', 'Language'],
        memory_aids: 'What? It\'s a word.',


class Card extends Backbone.View
    className: 'card'

    constructor: (options) ->
        super
        console.log 'init card.'

        @model = new CardModel()

        if options && options.title
            @fetch options.title

    render: ->
        @$el.html template(@model.toJSON())
        @

    fetch: (title) ->

module.exports = Card
