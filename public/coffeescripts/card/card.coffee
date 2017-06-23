Backbone = require 'backbone'

class Card extends Backbone.Model
    idAttribute: '_id'

    defaults:
        deck: 'default'
        title: ''
        explain: ''
        sub_title: ''
        content: ''
        tags: []
        connections: []
        connections: []
        memory_aids: ''

module.exports = Card

