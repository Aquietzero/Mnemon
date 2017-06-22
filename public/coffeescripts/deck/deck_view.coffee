$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './deck.css'

template = require './deck.ejs'

class DeckView extends Backbone.View
    className: 'deck-detail'

    render: ->
        @$el.html template(@model.toJSON())
        @

module.exports = DeckView
