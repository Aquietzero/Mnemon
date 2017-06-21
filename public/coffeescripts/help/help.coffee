$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './help.css'

template = require './help.ejs'

class HelpView extends Backbone.View
    className: 'help-page'

    constructor: (options) ->
        super
        console.log 'help reviews.'

    render: ->
        @$el.html template()
        @

module.exports = HelpView
