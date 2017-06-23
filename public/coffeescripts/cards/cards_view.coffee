$ = require 'jquery'
_ = require 'lodash'
Backbone = require 'backbone'
Mousetrap = require 'mousetrap'
require './cards.css'

event = require '../event.coffee'
ajax = require '../ajax.coffee'

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
        'click .add-a-card': 'addACard'
        'scroll .search-result': 'scrolling'

    constructor: (options) ->
        super
        console.log 'init cards.'

        @cardPreview
        @deck = options?.deck || 'default'
        @card = options?.card
        q = deck: @deck

        @query =
            q: q
            page: 0
            limit: 20
        @collection = new Cards()
        @listenTo @collection, 'add', @renderCard

        # global events.
        event.on 'card:create', (c) => @collection.unshift c

        # keyboard shortcuts.
        Mousetrap.bind 'option+n', @addACard.bind @

        @fetch()

    # TODO dummy way to adjust width
    adjustSearchBar: ->
        w = @$('.search-result').width()
        @$('.search-and-add').width w

    render: ->
        @$el.html template()
        @$('.cards-list').height $(window).height()

        # window events.
        window.addEventListener 'resize', @adjustSearchBar

        if @card
            @cardPreview = cardView = new CardView(title: @card)
            @$('.card-preview').html cardView.render().el
        @

    fetch: ->
        ajax
            url: '/cards'
            method: 'post'
            data:
                query: @query
            success: (res) =>
                @collection.add res.data
                @adjustSearchBar()
                unless @cardPreview
                    @$('.card-entry:first-child').click()

    renderCard: (card) =>
        cardEntry = new CardEntryView(model: card)

        if card is @collection.models[0]
            @$('.search-result').prepend cardEntry.render().el
        else
            @$('.search-result').append cardEntry.render().el

    preview: (e) ->
        if @cardPreview
            @cardPreview.remove()
            delete @cardPreview

        @$('.card-entry').removeClass 'active'
        $cardEntry = @$(e.currentTarget)
        $cardEntry.addClass 'active'

        title = $cardEntry.attr 'id'
        card = @collection.findWhere title: title
        @cardPreview = cardView = new CardView(model: card)
        @$('.card-preview').html cardView.render().el

        Backbone.history.navigate "#decks/#{@deck}/cards/#{card.get 'title'}"

    addACard: ->
        if @cardPreview
            @cardPreview.remove()
            delete @cardPreview

        card = new Card(deck: @deck)
        @cardPreview = cardView = new CardView(model: card)
        @$('.card-preview').html cardView.render().el
        cardView.$('input.title').focus()


module.exports = CardsView
