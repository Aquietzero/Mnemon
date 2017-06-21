$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
Mousetrap = require 'mousetrap'
require './review.css'

Card = require '../card/card.coffee'
CardView = require '../card/card_view.coffee'

template = require './review.ejs'

class ReviewView extends Backbone.View
    className: 'review-flow'

    constructor: (options) ->
        super
        console.log 'init reviews.'

        @cards = []
        @currentCard
        @currentIndex = 0
        @deck = options?.deck || 'default'
        q = deck: @deck

        @query =
            q: q
            page: 0
            limit: 20

        Mousetrap.bind 'left', @prevCard.bind @
        Mousetrap.bind 'right', @nextCard.bind @

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
                unless res.data && res.data.length > 0
                    return alert 'Last Card.'

                @cards = _.union @cards, res.data
                @addACard @cards[@currentIndex]

    addACard: (card) ->
        if @currentCard
            @currentCard.remove()
            delete @currentCard

        card = new Card(card)
        @currentCard = cardView = new CardView(model: card)
        @$('.current-card').html cardView.render().el

    nextCard: ->
        if @currentIndex is @cards.length - 1
            return alert 'Last Card.'

        @currentIndex++
        if @cards[@currentIndex]
            @addACard @cards[@currentIndex]
        else
            @query.page++
            @fetch()

    prevCard: ->
        if @currentIndex is 0
            return alert 'First Card.'

        @currentIndex--
        if @cards[@currentIndex]
            @addACard @cards[@currentIndex]

module.exports = ReviewView
