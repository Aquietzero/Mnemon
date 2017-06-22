$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './decks.css'

template = require './decks.ejs'
deck_entry_template = require './deck_entry.ejs'

Deck = require '../deck/deck.coffee'
DeckView = require '../deck/deck_view.coffee'


class Decks extends Backbone.Collection
    model: Deck


class DeckEntryView extends Backbone.View
    className: 'item deck-entry'

    render: ->
        @$el.html deck_entry_template(@model.toJSON())
        @$el.attr 'id', @model.get('name')
        @

class DecksView extends Backbone.View
    className: 'decks'

    events:
        'click .deck-entry': 'preview'
        'click .add-a-deck .submit': 'addADeck'
        'click .toggle-add-a-deck': 'toggleAddADeck'

    constructor: (options) ->
        super
        console.log 'init decks.'

        @query =
            q: {}
            page: 0
            limit: 20
        @collection = new Decks()
        @listenTo @collection, 'add', @renderDeck

        @fetch()

    render: ->
        @$el.html template()
        @$('.decks-list').height $(window).height()
        @

    fetch: ->
        $.ajax
            url: '/decks'
            method: 'post'
            data:
                query: @query
            success: (res) =>
                @collection.add res.data
                @$('.deck-entry:first-child').click()

    renderDeck: (deck) ->
        deckEntry = new DeckEntryView(model: deck)
        @$('.search-result').append deckEntry.render().el

    toggleAddADeck: ->
        @$('.add-a-deck .form').toggleClass 'hide'

    addADeck: ->
        name = @$('input[name="name"]').val()
        description = @$('input[name="description"]').val()

        $.ajax
            url: '/decks/update'
            method: 'post'
            data:
                name: name
                description: description
            success: (res) =>
                @collection.unshift res.data

    preview: (e) ->
        $entry = $(e.currentTarget)
        name = $entry.attr 'id'
        deck = @collection.findWhere name: name
        deckView = new DeckView(model: deck)
        @$('.deck-preview').html deckView.render().el


module.exports = DecksView
