Backbone = require 'backbone'

class Router extends Backbone.Router
    routes:
        '': 'card'
        'card(/:title)': 'card'

    constructor: (opts) ->
        super opts
        @app = opts.app

    renderPage: (page, params) ->
        console.log "render page #{page}."
        @app.renderPage page, params

    card: -> @renderPage 'card', arguments

module.exports = Router

