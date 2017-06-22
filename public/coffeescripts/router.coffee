Backbone = require 'backbone'

class Router extends Backbone.Router
    routes:
        '': 'decks'
        'cards/detail(/:title)': 'card'
        'cards/list': 'cards' # View all cards.
        'decks/list': 'decks'
        'decks/detail/:deck': 'deck'
        'decks/:deck/cards': 'cards' # View cards in a deck.
        'decks/:deck/review': 'review' # Review cards of a deck.

        'help': 'help'

    constructor: (opts) ->
        super opts
        @app = opts.app

    renderPage: (page, params) ->
        console.log "render page #{page}."
        @app.renderPage page, params

    card: -> @renderPage 'card', arguments
    cards: -> @renderPage 'cards', arguments
    deck: -> @renderPage 'deck', arguments
    decks: -> @renderPage 'decks', arguments
    review: -> @renderPage 'review', arguments

    help: -> @renderPage 'help', arguments

module.exports = Router

