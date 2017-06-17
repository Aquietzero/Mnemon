Backbone = require 'backbone'

class Router extends Backbone.Router
    routes:
        '': 'decks'
        'cards/detail(/:title)': 'card'
        'cards/list': 'cards'
        'decks/list': 'decks'

    constructor: (opts) ->
        super opts
        @app = opts.app

    renderPage: (page, params) ->
        console.log "render page #{page}."
        @app.renderPage page, params

    card: -> @renderPage 'card', arguments
    cards: -> @renderPage 'cards', arguments
    decks: -> @renderPage 'decks', arguments

module.exports = Router

