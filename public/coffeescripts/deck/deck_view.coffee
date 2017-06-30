$ = require 'jquery'
_ = require 'lodash'
Backbone = require 'backbone'
require './deck.css'

template = require './deck.ejs'
Deck = require './deck.coffee'

class DeckView extends Backbone.View
    className: 'deck-detail'

    events:
        'click .setup-review': 'setupReview'
        'click .start-review': 'startReview'

    constructor: (opts) ->
        super opts

        @reviewStats = setup: false, stats: {}
        if opts.deck
            @model = new Deck(name: opts.deck)
            @fetchReviewStats()

    render: ->
        @$el.html template(_.extend @model.toJSON(), reviewStats: @reviewStats)
        @$('.stats .ui.progress').each (index, el) =>
            window.$(el).progress percent: parseInt($(el).attr('data-percent'))
        @

    fetchReviewStats: ->
        $.ajax
            url: "/review/#{@model.get 'name'}/statistics"
            success: (res) =>
                return alert res.err unless res.message is 'ok'
                @model.set res.data.deck
                @reviewStats = res.data
                @render()

    setupReview: ->
        $.ajax
            url: "/review/#{@model.get 'name'}/setup"
            success: (res) =>
                return alert res.err unless res.message is 'ok'
                @fetchReviewStats()

    startReview: ->
        window.location = "/#decks/#{@model.get 'name'}/review"

module.exports = DeckView
