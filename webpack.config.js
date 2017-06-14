var path = require('path');
var webpack = require('webpack');


module.exports = {
    entry: path.join(__dirname, 'public/coffeescripts/app.coffee'),
    output: {
        path: path.join(__dirname, 'public/javascripts'),
        filename: 'bundle.js'
    },
    module: {
        resolve: {
            modulesDirectories: ['web_modules', 'node_modules']
        },
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.ejs$/,
            loader: 'ejs-loader?variable=data'
        }, {
            test: /\.coffee$/,
            loader: "coffee-loader"
        }, {
            test: /\.(coffee\.md|litcoffee)$/,
            loader: "coffee-loader?literate"
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
        }],
        plugins: [
            new webpack.ProvidePlugin({_: 'underscore'}),
        ]
    }
}

