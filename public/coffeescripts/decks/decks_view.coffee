$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './decks.css'

template = require './decks.ejs'
deck_entry_template = require './deck_entry.ejs'

class Deck extends Backbone.Model
    defaults:
        name: 'Default Deck'
        description: 'A default deck.'
        number_of_cards: 0

class Decks extends Backbone.Collection
    model: Deck

class DeckEntryView extends Backbone.View
    className: 'item deck-entry'

    events:
        'click .header': 'toDeckCards'
        'click .review': 'toReview'

    render: ->
        @$el.html deck_entry_template(@model.toJSON())
        @$el.attr 'id', @model.get('name')
        @

    toDeckCards: ->
        window.location = "/#decks/#{@model.get 'name'}/cards"

    toReview: ->
        window.location = "/#decks/#{@model.get 'name'}/review"


class DecksView extends Backbone.View
    className: 'decks'

    events:
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
        @$('.cards-list').height $(window).height()
        @

    fetch: ->
        $.ajax
            url: '/decks'
            method: 'post'
            data:
                query: @query
            success: (res) =>
                @collection.add res.data

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


module.exports = DecksView
