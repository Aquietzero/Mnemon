$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
Mousetrap = require 'mousetrap'
require './card.css'

event = require '../event.coffee'
socket = require '../socket.coffee'

template = require './card.ejs'
explainTemplate = require './word_explain.ejs'
Card = require './card.coffee'

class CardView extends Backbone.View
    className: 'card'

    events:
        'change input': 'updateModel'
        'change textarea': 'updateModel'
        'click .submit': 'submit'
        'click .autofill': 'autoFillCard'

    constructor: (options = model: new Card()) ->
        super
        console.log 'init card.'

        @model = options.model
        if options && options.title
            @fetch options.title

        socket.on 'searched:word', (res) =>
            unless res.err
                @wordExplain = res.data
                @renderWordExplain res.data

        @listenTo @model, 'change', @render.bind(@)

        Mousetrap.bind 'option+c', @autoFillCard.bind @
        Mousetrap.bind 'option+s', @submit.bind @

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

        @searchWord() if key is 'title'

    submit: ->
        $.ajax
            url: '/cards/update'
            data: _.omit(@model.toJSON(), '_id')
            method: 'post'
            success: (res) =>
                unless res.message is 'ok'
                    return alert JSON.stringify(res.error)
                event.trigger 'card:create', new Card(res.data)
                # window.location = "/#cards/detail/#{res.data.title}"

    searchWord: (e) ->
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

    autoFillCard: ->
        console.log 'we', @wordExplain

        return unless @wordExplain or @wordExplain.explains

        explains = @wordExplain.explains
        @model.set 'sub_title', "#{explains[0].kana}#{explains[0].tone}"

        # '2. 禁，戒，戒除。〔禁止する〕。たばこを戒める。戒烟。'
        # extract '禁，戒，戒除' from the above sentence. the leading '2' is
        # no necessarily a number.
        briefExplainRe = /\.\s+(.*?)。/g
        briefExplains = _.compact(_.flatten(_.map @wordExplain.explains, (e) ->
            results = []
            r = briefExplainRe.exec e.content
            while r
                results.push r[1]
                r = briefExplainRe.exec e.content
            _.compact results
        ))

        @model.set 'explain', briefExplains.join('\n')
        @model.set 'content', _.pluck(explains, 'content').join('\r\r')

        console.log @model.toJSON()

module.exports = CardView
