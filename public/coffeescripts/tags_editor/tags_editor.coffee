$ = require 'jquery'
_ = require 'underscore'
Backbone = require 'backbone'
require './tags_editor.css'

template = require './tags_editor.ejs'
tagsTemplate = require './tags.ejs'


# Tags Editor is used for management of a group of keywords, which
# can be word tags or similar connections.
class Tag extends Backbone.Model
    defaults:
        name: ''

class Tags extends Backbone.Collection
    model: Tag

class TagsEditorView extends Backbone.View
    className: 'tags-editor'

    events:
        'keyup .add-a-tag': 'addATag'
        'click .delete': 'deleteTag'
        'click .toggle-edit': 'toggleEdit'

    constructor: ->
        super
        console.log 'init tags editor.'

        @collection = new Tags([{name: 'tag1'}, {name: 'tag2'}])

        @listenTo @collection, 'add', @renderTags.bind @
        @listenTo @collection, 'remove', @renderTags.bind @
        @listenTo @collection, 'reset', @renderTags.bind @

    getTags: ->
        _.unique _.map(@collection.models, (m) -> m.get 'name')

    setTags: (tags) ->
        @collection.reset _.map(tags, (t) -> new Tag(name: t))

    render: ->
        @$el.html template()
        @renderTags()
        @

    renderTags: ->
        @$('.tags-display').html tagsTemplate(tags: _.map(@collection.models, (m) => m.toJSON()))

    addATag: (e) ->
        return unless e.keyCode is 13

        tag = @$('.add-a-tag').val()
        @collection.add new Tag(name: tag) unless @collection.findWhere(name: tag)

    deleteTag: (e) ->
        $tag = $(e.currentTarget).parent()
        name = $tag.attr 'name'
        console.log name
        @collection.remove @collection.findWhere(name: name)

    toggleEdit: ->
        @$('.tags-edit').toggleClass 'hide'


module.exports = TagsEditorView
