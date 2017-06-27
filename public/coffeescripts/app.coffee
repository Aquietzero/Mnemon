$ = require 'jquery'

require 'semantic-ui/dist/semantic.min'
require 'semantic-ui/dist/semantic.min.css'

require './app.css'

Backbone = require 'backbone'

Router = require './router.coffee'

Dashboard = require './dashboard/dashboard.coffee'
CardView = require './card/card_view.coffee'
CardsView = require './cards/cards_view.coffee'
DecksView = require './decks/decks_view.coffee'
ReviewView = require './review/review.coffee'
HelpView = require './help/help.coffee'

class App extends Backbone.View
    constructor: (options) ->
        super options
        @currentPage
        @dashboard = new Dashboard()

    render: ->
        @$('.content').html @dashboard.render().el

    renderPage: (page, params) ->
        if @currentPage
            @currentPage.remove()
            delete @currentPage

        console.log "app: render #{page}, #{params}"

        $('body').removeClass 'zen-mode'
        switch page
            when 'card'
                @currentPage = new CardView(title: params[0])
                @$('.content').html @currentPage.render().el
            when 'cards'
                @currentPage = new CardsView(deck: params[0], card: params[1])
                @$('.content').html @currentPage.render().el
            when 'decks'
                @currentPage = new DecksView()
                @$('.content').html @currentPage.render().el
            when 'review'
                $('body').addClass 'zen-mode'
                @currentPage = new ReviewView(deck: params[0])
                @$('.content').html @currentPage.render().el
            when 'help'
                @currentPage = new HelpView()
                @$('.content').html @currentPage.render().el
            else @render()

        window.$('.selection.dropdown').dropdown()


$('document').ready ->
    app = new App(el: 'body')
    app.render()
    router = new Router(app: app)
    Backbone.history.start()

