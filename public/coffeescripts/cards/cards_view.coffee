$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './cards.css'

event = require '../event.coffee'

template = require './cards.ejs'
card_entry_template = require './card_entry.ejs'
Cards = require './cards.coffee'

Card = require '../card/card.coffee'
CardView = require '../card/card_view.coffee'

class CardEntryView extends Backbone.View
    className: 'item card-entry'

    render: ->
        @$el.html card_entry_template(@model.toJSON())
        @$el.attr 'id', @model.get('title')
        @

    showPreview: ->
        @emit 'show:preview', @

class CardsView extends Backbone.View
    className: 'cards'

    events:
        'click .card-entry': 'preview'
        'click .add-a-word': 'addAWord'

    constructor: (options) ->
        super
        console.log 'init cards.'

        @deck = options?.deck || 'default'
        q = deck: @deck

        @query =
            q: q
            page: 0
            skip: 0
            limit: 20
        @collection = new Cards()
        @listenTo @collection, 'add', @renderCard
        event.on 'card:create', @renderCard
        @cardPreview

        @fetch()

    render: ->
        @$el.html template()
        @$('.cards-list').height $(window).height()
        @

    fetch: ->
        console.log @query
        $.ajax
            url: '/cards'
            method: 'post'
            data: query: JSON.stringify @query
            success: (res) =>
                @collection.add res.data

                unless @cardPreview
                    @$('.card-entry').click()

    renderCard: (card) =>
        cardEntry = new CardEntryView(model: card)
        @$('.search-result').append cardEntry.render().el

    preview: (e) ->
        if @cardPreview
            @cardPreview.remove()
            delete @cardPreview

        $cardEntry = @$(e.currentTarget)
        title = $cardEntry.attr 'id'
        card = @collection.findWhere title: title
        @cardPreview = cardView = new CardView(model: card)
        @$('.card-preview').html cardView.render().el

    addAWord: ->
        if @cardPreview
            @cardPreview.remove()
            delete @cardPreview

        card = new Card(deck: @deck)
        @cardPreview = cardView = new CardView(model: card)
        @$('.card-preview').html cardView.render().el


module.exports = CardsView
