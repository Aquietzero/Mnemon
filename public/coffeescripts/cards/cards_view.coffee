$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './cards.css'

template = require './cards.ejs'
card_entry_template = require './card_entry.ejs'
Cards = require './cards.coffee'

class CardEntryView extends Backbone.View
    className: 'item card-entry'

    render: ->
        @$el.html card_entry_template(@model.toJSON())
        @

class CardsView extends Backbone.View
    className: 'cards'

    constructor: (options) ->
        super
        console.log 'init cards.'

        @query =
            q: {}
            page: 0
            limit: 20
        @collection = new Cards()
        @listenTo @collection, 'add', @renderCard

        @fetch()

    render: ->
        @$el.html template()
        @

    fetch: ->
        $.ajax
            url: '/cards'
            method: 'post'
            data:
                query: @query
            success: (res) =>
                console.log res.data
                @collection.add res.data

    renderCard: (card) ->
        console.log card
        cardEntry = new CardEntryView(model: card)
        @$('.search-results').append cardEntry.render().el


module.exports = CardsView
