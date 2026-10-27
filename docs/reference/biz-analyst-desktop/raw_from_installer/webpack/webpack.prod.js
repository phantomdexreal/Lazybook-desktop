const merge = require('webpack-merge');
const common = require('./webpack.common.js')

module.exports = [
    merge(common.mainConfig, {
        mode: 'production',
        optimization: {
            minimize: true
        }
    }),
    merge(common.backgroundRendererConfig, {
        mode: 'production',
        optimization: {
            minimize: true
        }
    })
]