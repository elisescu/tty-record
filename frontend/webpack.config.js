const webpack = require('webpack');

module.exports = {
    entry: {
        mainApp: __dirname + '/main.js',
    },
    output: {
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                // Don't parse the xterm map files - webpack doesn't like them
                test: /node_modules.+xterm.+\.map$/,
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
            }
        ]
    },
    plugins: [

        // TODO: Find out how to disable and enable this from outside
        //new webpack.optimize.UglifyJsPlugin()
    ]
};
