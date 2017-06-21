Backbone = require 'backbone'

class Router extends Backbone.Router
    routes:
        '': 'decks'
        'cards/detail(/:title)': 'card'
        'cards/list': 'cards' # View all cards.
        'decks/list': 'decks'
        'decks/:deck/cards': 'cards' # View cards in a deck.
        'decks/:deck/review': 'review' # Review cards of a deck.

    constructor: (opts) ->
        super opts
        @app = opts.app

    renderPage: (page, params) ->
        console.log "render page #{page}."
        @app.renderPage page, params

    card: -> @renderPage 'card', arguments
    cards: -> @renderPage 'cards', arguments
    decks: -> @renderPage 'decks', arguments
    review: -> @renderPage 'review', arguments

module.exports = Router

