const webpack = require('webpack');

module.exports = {
    entry: {
        mainApp: __dirname + '/main.js',
    },
    output: {
        filename: 'app.js'
    },
    devtool: 'inline-source-map',
    resolve: {
        modules: [".", "node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: ['url-loader', 'image-webpack-loader']
            },
            {
                // Don't parse the xterm map files - webpack doesn't like them
                test: /other_modules.+xterm.+\.map$/,
                use: 'ignore-loader'
            },
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: ['env']
                    }
                }]
            },
            {
                test: /\.js\.map$/,
                use: ['source-map-loader']
            }
        ]
    },
    plugins: [

        // TODO: Find out how to disable and enable this from outside
        //new webpack.optimize.UglifyJsPlugin()
    ]
};
