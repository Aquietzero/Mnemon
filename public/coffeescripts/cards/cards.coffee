Backbone = require 'backbone'
Card = require '../card/card.coffee'

class Cards extends Backbone.Collection
    model: Card

module.exports = Cards
