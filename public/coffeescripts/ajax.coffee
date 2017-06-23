_ = require 'lodash'
$ = require 'jquery'

ajax = (opts) ->
    opts.contentType = 'application/json'
    if opts.data and _.isObject opts.data
        opts.data = JSON.stringify opts.data

    $.ajax opts

module.exports = ajax
