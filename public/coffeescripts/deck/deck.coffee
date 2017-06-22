Backbone = require 'backbone'

class Deck extends Backbone.Model
    defaults:
        name: 'Default Deck'
        description: 'A default deck.'
        number_of_cards: 0

module.exports = Deck
