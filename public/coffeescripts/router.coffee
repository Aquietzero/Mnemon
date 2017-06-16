Backbone = require 'backbone'

class Router extends Backbone.Router
    routes:
        '': 'card'
        'cards/detail(/:title)': 'card'
        'cards/list': 'cards'

    constructor: (opts) ->
        super opts
        @app = opts.app

    renderPage: (page, params) ->
        console.log "render page #{page}."
        @app.renderPage page, params

    card: -> @renderPage 'card', arguments
    cards: -> @renderPage 'cards', arguments

module.exports = Router

