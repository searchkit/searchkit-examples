let path = require("path")
let webpack = require("webpack")
let ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry:  {
        server: './src/server.js',
        client: './src/search/search-client-app.jsx',
    },
    output: {
        filename: '[name].js',
        path:     path.join(__dirname, 'dist')
    },
    target:'node',
    module: {
        rules: [
            {
                test:    /\.jsx?$/,
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                loader:  'babel-loader',
                query:   {
                    presets: ['react', 'stage-0']
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: "css-loader"
                }),
                include: [
                    path.resolve(__dirname, "src")
                ]            
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new ExtractTextPlugin("search-styles.css")
    ],
    externals:{
        "express":"commonjs express"
    },
    resolve:{
        alias:{
            react:path.resolve("./node_modules/react"),
            'react-dom':path.resolve("./node_modules/react-dom")
        }
    }
}
