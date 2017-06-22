$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
Mousetrap = require 'mousetrap'
require './review_card.css'

template = require './review_card.ejs'
Card = require '../card/card.coffee'


class ReviewCardView extends Backbone.View
    className: 'card'

    constructor: (options = model: new Card()) ->
        super
        console.log 'init review card.'

        @model = options.model
        # Mousetrap.bind 'option+c', @autoFillCard.bind @
        # Mousetrap.bind 'option+s', @submit.bind @

    render: ->
        @$el.html template(@model.toJSON())
        @

module.exports = ReviewCardView
