$ = require 'jquery'
_ = require 'lodash'
Backbone = require 'backbone'
Highcharts = require 'highcharts/highcharts'
require './deck.css'

ajax = require '../ajax.coffee'

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

    fetchBoxDistribution: ->
        ajax
            url: "/review/#{@model.get 'name'}/box_distribution"
            success: (res) =>
                return alert res.err unless res.message is 'ok'

                @graph1 = Highcharts.chart 'box-distribution-graph',
                    chart:
                        type: 'column'
                    xAxis:
                        type: 'datetime'
                    yAxis:
                        title:
                            text: 'number of cards'
                    title:
                        text: 'Box distribution of the recent 10 days.'
                    plotOptions:
                        column:
                            stacking: 'normal'
                    series: res.data

    fetchEfficiency: ->
        ajax
            url: "/review/#{@model.get 'name'}/efficiency"
            success: (res) =>
                return alert res.err unless res.message is 'ok'

                @graph = Highcharts.chart 'efficiency-graph',
                    title:
                        text: 'Efficiency of the recent 10 days.'
                    xAxis:
                        type: 'datetime'
                    yAxis:
                        title:
                            text: 'efficiency rate'
                    series: [{
                        name: 'efficiency',
                        data: res.data
                    }]

    fetchReviewStats: ->
        ajax
            url: "/review/#{@model.get 'name'}/statistics"
            success: (res) =>
                return alert res.err unless res.message is 'ok'
                @model.set res.data.deck
                @reviewStats = res.data
                @render()

                @fetchEfficiency()
                @fetchBoxDistribution()

    setupReview: ->
        $.ajax
            url: "/review/#{@model.get 'name'}/setup"
            success: (res) =>
                return alert res.err unless res.message is 'ok'
                @fetchReviewStats()

    startReview: ->
        window.location = "/#decks/#{@model.get 'name'}/review"

module.exports = DeckView
