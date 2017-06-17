$ = require 'jquery'

require 'semantic-ui/dist/semantic.min'
require 'semantic-ui/dist/semantic.min.css'

Backbone = require 'backbone'

Router = require './router.coffee'

Dashboard = require './dashboard/dashboard.coffee'
CardView = require './card/card_view.coffee'
CardsView = require './cards/cards_view.coffee'
DecksView = require './decks/decks_view.coffee'

class App extends Backbone.View
    constructor: (options) ->
        super options
        @dashboard = new Dashboard()

    render: ->
        @$('.content').html @dashboard.render().el

    renderPage: (page, params) ->
        console.log "app: render #{page}, #{params}"
        switch page
            when 'card'
                card = new CardView(title: params[0])
                @$('.content').html card.render().el
            when 'cards'
                cards = new CardsView()
                @$('.content').html cards.render().el
            when 'decks'
                decks = new DecksView()
                @$('.content').html decks.render().el
            else @render()

        window.$('.selection.dropdown').dropdown()


$('document').ready ->
    app = new App(el: 'body')
    app.render()
    router = new Router(app: app)
    Backbone.history.start()

