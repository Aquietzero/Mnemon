$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './zen_card.css'

template = require './zen_card.ejs'
Card = require '../card/card.coffee'


class ZenCardView extends Backbone.View
    className: 'zen-card'

    constructor: (options = model: new Card()) ->
        super
        console.log 'init zen card.'
        @model = options.model

    render: ->
        @$el.html template(@model.toJSON())
        @

module.exports = ZenCardView
