const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')

const rootPath = path.join(__dirname, '../')

const mainConfig = {
    entry: path.join(rootPath, './electron/index.ts'),
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{ loader: 'ts-loader' }]
            },
        ],
    },
    resolve: {
        alias: {
            sequelize: path.join(rootPath, '../node_modules/sequelize')
        },
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        filename: 'main.js',
        path: rootPath

    },
    externals: {
        sequelize: "require('sequelize')",
        sqlite3: "require('sqlite3')"
    },
    target: "electron-main",
    plugins: [
        new CopyPlugin([
            { from: 'src/assets', to: 'assets' }
        ]),
    ],
    node: {
        __dirname: false
    }
};

const backgroundRendererConfig = {
    entry: path.join(rootPath, './src/background/background.ts'),
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{ loader: 'ts-loader' }]
            },
        ],
    },
    resolve: {
        alias: {
            sequelize: path.join(rootPath, '../node_modules/sequelize')
        },
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        filename: 'background.bundle.js',
        path: path.join(rootPath, 'electron/background')
    },
    externals: {
        sequelize: "require('sequelize')",
        sqlite3: "require('sqlite3')",
    },
    target: "electron-renderer",
    node: {
        __dirname: false
    }
};

module.exports = {
    mainConfig, backgroundRendererConfig
}