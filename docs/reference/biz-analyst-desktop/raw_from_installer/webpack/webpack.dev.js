const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = [
    merge(common.mainConfig, {
        mode: 'development',
        devtool: 'inline-source-map'
    }),
    merge(common.backgroundRendererConfig, {
        mode: 'development',
        devtool: 'inline-source-map'
    })
]