$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
Mousetrap = require 'mousetrap'
require './review.css'

Card = require '../card/card.coffee'
ReviewCardView = require '../review_card/review_card_view.coffee'

template = require './review.ejs'

class ReviewView extends Backbone.View
    className: 'review-flow'

    events:
        'click .remember': 'remember'
        'click .not-remember': 'notRemember'

    constructor: (options) ->
        super
        console.log 'init reviews.'

        @cards = []
        @currentCard
        @n = 20
        @currentIndex = 0
        @deck = options?.deck || 'default'

        # Mousetrap.bind 'left', @prevCard.bind @
        # Mousetrap.bind 'right', @nextCard.bind @
        Mousetrap.bind 'n', @remember.bind @
        Mousetrap.bind 'p', @notRemember.bind @

        @fetch()

    render: ->
        @$el.html template()
        @

    fetch: ->
        $.ajax
            url: '/review/pick'
            method: 'post'
            data:
                deck: @deck
                n: @n
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
        @currentCard = cardView = new ReviewCardView(model: card)
        @$('.current-card').html cardView.render().el

    nextCard: ->
        if @currentIndex is @cards.length - 1
            return alert 'Last Card.'

        @currentIndex++
        if @cards[@currentIndex]
            @addACard @cards[@currentIndex]
        else
            @fetch()

    prevCard: ->
        if @currentIndex is 0
            return alert 'First Card.'

        @currentIndex--
        if @cards[@currentIndex]
            @addACard @cards[@currentIndex]

    remember: ->

    notRemember: ->

module.exports = ReviewView
