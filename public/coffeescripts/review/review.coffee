$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
Mousetrap = require 'mousetrap'
require './review.css'

MobileDetect = require '../device.coffee'
ajax = require '../ajax.coffee'

Card = require '../card/card.coffee'
ReviewCardView = require '../review_card/review_card_view.coffee'
ZenCardView = require '../zen_card/zen_card_view.coffee'

template = require './review.ejs'

class ReviewView extends Backbone.View
    className: 'review-flow'

    events:
        'click .remember': 'remember'
        'click .not-remember': 'notRemember'
        'click .back-to-deck': 'backToDeck'

    constructor: (options) ->
        super
        console.log 'init reviews.'

        @cards = []
        @currentCard
        @n = 20
        @currentIndex = 0
        @deck = options?.deck || 'default'

        Mousetrap.bind 'left', @prevCard.bind @
        # Mousetrap.bind 'right', @nextCard.bind @
        Mousetrap.bind 'up', @remember.bind @
        Mousetrap.bind 'down', @notRemember.bind @

        @fetch()

    render: ->
        @$el.html template()
        @

    fetch: ->
        ajax
            url: '/review/pick'
            method: 'post'
            data:
                deck: @deck
                n: @n
            success: (res) =>
                unless res.data && res.data.length > 0
                    return alert 'No cards to review'

                # @cards = _.union @cards, res.data
                @cards = res.data
                @currentIndex = 0
                @addACard @cards[@currentIndex]

    addACard: (card) ->
        if @currentCard
            @currentCard.remove()
            delete @currentCard

        card = new Card(card)
        CardView = if MobileDetect.mobile() then ZenCardView else ReviewCardView
        @currentCard = cardView = new CardView(model: card)
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
        card = @currentCard.model.get 'title'
        @rememberACard card, true

    notRemember: ->
        card = @currentCard.model.get 'title'
        @rememberACard card, false

    rememberACard: (card, remembered) ->
        ajax
            url: '/review/put'
            method: 'post'
            data:
                deck: @deck
                card: card
                remembered: remembered
            success: (res) =>
                return alert res.error unless res.message is 'ok'
                @nextCard()

    backToDeck: ->
        window.location = "/#decks/detail/#{@currentCard.model.get 'deck'}"

module.exports = ReviewView
