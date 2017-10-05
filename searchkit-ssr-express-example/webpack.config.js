let path = require("path")
let webpack = require("webpack")

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
        loaders: [
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
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
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
