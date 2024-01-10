const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
    entry: {
        //serial: './src/serial.js',
        // load code from the scr lib math.js to be available in the app
        webpackimports: './src/webpack-loader.js',
        app: {
            import: './src/pages/app.js',
            dependOn: ['math', 'webpackimports']
        },
        //canvastxt: './src/lib/canvas-txt.js',
        math:  './src/lib/math.js'
    },
    module:{
        rules:[
        { test: /\.css$/, use: ['style-loader', 'css-loader']},
        ],
    },
    node: {
    global: true
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        globalObject: 'window',
        //filename: 'appbundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(
            __dirname, './public/experiment-webpack.html')}),
        new webpack.DefinePlugin({
            'process': {
                WEBPACK_BUILD: JSON.stringify(true)
                // Add other environment variables here if necessary
            }
    })]
};