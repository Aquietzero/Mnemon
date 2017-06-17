$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './card.css'

event = require '../event.coffee'
socket = require '../socket.coffee'

template = require './card.ejs'
explainTemplate = require './word_explain.ejs'
Card = require './card.coffee'

class CardView extends Backbone.View
    className: 'card'

    events:
        'blur .title': 'searchWord'
        'change input': 'updateModel'
        'change textarea': 'updateModel'
        'click .submit': 'submit'

    constructor: (options = model: new Card()) ->
        super
        console.log 'init card.'

        @model = options.model
        if options && options.title
            @fetch options.title

        socket.on 'searched:word', (res) =>
            @renderWordExplain res.data unless res.err

    render: ->
        @$el.html template(@model.toJSON())
        @

    fetch: (title) ->
        $.ajax
            url: '/cards/detail'
            data: {title: title}
            method: 'post'
            success: (res) =>
                unless res.message is 'ok'
                    return alert JSON.stringify(res.error)
                @model.set res.data
                @render()

    updateModel: (e) ->
        $input = $(e.currentTarget)
        key = $input.attr 'name'
        val = $input.val()

        if key and val
            @model.set key, val

    submit: ->
        console.log @model.toJSON()

        $.ajax
            url: '/cards/update'
            data: _.omit(@model.toJSON(), '_id')
            method: 'post'
            success: (res) =>
                unless res.message is 'ok'
                    return alert JSON.stringify(res.error)
                event.trigger 'card:create', new Card(res.data)
                # window.location = "/#cards/detail/#{res.data.title}"

    searchWord: ->
        title = @$('.title').val()
        console.log(title)
        return unless title
        socket.emit 'search:word', title

    renderWordExplain: (data) ->
        if data.explains and data.explains.length > 0
            @$('.word-explain').html explainTemplate(data)
            @$('.word-explain').addClass('show')
        else
            @$('.word-explain').removeClass('show')

module.exports = CardView
