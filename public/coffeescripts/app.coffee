$ = require 'jquery'

require 'semantic-ui/dist/semantic.min'
require 'semantic-ui/dist/semantic.min.css'

Backbone = require 'backbone'

Router = require './router.coffee'

Dashboard = require './dashboard/dashboard.coffee'
Card = require './card/card.coffee'

class App extends Backbone.View
    constructor: (options) ->
        super options
        @dashboard = new Dashboard()
        @card = new Card()

    render: ->
        @$('.content').html @dashboard.render().el

    renderPage: (page, params) ->
        console.log "app: render #{page}, #{params}"
        switch page
            when 'card'
                @$('.content').html @card.render().el
            else @render()

        window.$('.selection.dropdown').dropdown()


$('document').ready ->
    app = new App(el: 'body')
    app.render()
    router = new Router(app: app)
    Backbone.history.start()

