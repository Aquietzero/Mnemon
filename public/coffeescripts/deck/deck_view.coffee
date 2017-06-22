$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './deck.css'

template = require './deck.ejs'

class DeckView extends Backbone.View
    className: 'deck-detail'

    events:
        'click .setup-review': 'setupReview'
        'click .start-review': 'startReview'

    constructor: (opts) ->
        super opts
        @reviewStats = setup: false, stats: {}

    render: ->
        @$el.html template(_.extend @model.toJSON(), reviewStats: @reviewStats)
        @

    fetchReviewStats: ->
        $.ajax
            url: "/review/#{@model.get 'name'}/statistics"
            success: (res) =>
                return alert res.err unless res.message is 'ok'
                @reviewStats = res.data
                @render()

    setupReview: ->
        $.ajax
            url: "/review/#{@model.get 'name'}/setup"
            success: (res) =>
                return alert res.err unless res.message is 'ok'
                @fetchReviewStats()

module.exports = DeckView
