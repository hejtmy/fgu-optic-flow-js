const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
    entry: {
        bootstrap: './src/bootstrap-loader.js',
        //serial: './src/serial.js',
        app: './src/pages/app.js',
        //app: { dependOn: 'serial', import: './src/stars/app.js' },
    },
    module:{
        rules:[
        { test: /\.css$/, use: ['style-loader', 'css-loader']},
        ],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        //filename: 'index_bundle.js',
    },
    plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, './public/experiment-webpack.html')})],
};