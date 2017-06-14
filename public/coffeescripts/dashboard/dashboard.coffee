_ = require 'underscore'
Backbone = require 'backbone'
require './dashboard.css'

template = require './dashboard.ejs'

class Dashboard extends Backbone.View
    className: 'dashboard'

    constructor: ->
        super
        console.log 'init dashboard.'

    render: ->
        @$el.html template(title: 'hello')
        @

module.exports = Dashboard
