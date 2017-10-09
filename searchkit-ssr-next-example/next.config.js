module.exports = {
    webpack: (config, { dev }) => {
        config.module.rules.push({
            test: /\.css$/,
            loader: 'emit-file-loader',
            options: {
                name: 'dist/[path][name].[ext]'
            }
        });

        config.module.rules.push({
            test: /\.css$/,
            use: [ 'raw-loader', 'postcss-loader' ]                
        });
        return config
    }
}
