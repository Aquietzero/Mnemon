$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './card.css'

socket = require '../socket.coffee'

template = require './card.ejs'
explainTemplate = require './word_explain.ejs'

class CardModel extends Backbone.Model
    defaults:
        title: 'Word'
        sub_title: 'A basic unit to express something.'
        content: 'Words build sentences, which build a language.'
        # tags: ['language', 'noun'],
        # connections: ['Sentence', 'Language'],
        tags: []
        connections: []
        memory_aids: 'What? It\'s a word.'


class Card extends Backbone.View
    className: 'card'

    events:
        'blur .title': 'searchWord'
        'change input': 'updateModel'
        'change textarea': 'updateModel'
        'click .submit': 'submit'

    constructor: (options) ->
        super
        console.log 'init card.'

        @model = new CardModel()

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
            data: @model.toJSON()
            method: 'post'
            success: (res) =>
                unless res.message is 'ok'
                    return alert JSON.stringify(res.error)
                window.location = "/#cards/#{res.data.title}"

    searchWord: ->
        title = @$('.title').val()
        return unless title
        socket.emit 'search:word', title

    renderWordExplain: (data) ->
        @$('.word-explain').html explainTemplate(data)

module.exports = Card
