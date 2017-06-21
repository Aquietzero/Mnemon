$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './review.css'

Card = require '../card/card.coffee'
CardView = require '../card/card_view.coffee'

template = require './review.ejs'

class ReviewView extends Backbone.View
    className: 'review-flow'

    constructor: (options) ->
        super
        console.log 'init reviews.'
        @currentCard
        @deck = options?.deck || 'default'
        q = deck: @deck

        @query =
            q: q
            page: 0
            limit: 20

        @fetch()

    render: ->
        @$el.html template()
        @

    fetch: ->
        $.ajax
            url: '/cards'
            method: 'post'
            data: query: JSON.stringify @query
            success: (res) =>
                card = res.data[0]
                @addACard card

    addACard: (card) ->
        if @currentCard
            @currentCard.remove()
            delete @currentCard

        card = new Card(card)
        @currentCard = cardView = new CardView(model: card)
        @$('.current-card').html cardView.render().el


module.exports = ReviewView
