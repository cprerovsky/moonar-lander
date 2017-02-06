'use strict';

const webpack = require('webpack');
const path = require('path');
const srcPath = path.join(__dirname, 'src');

module.exports = {
    target: 'web',
    cache: true,
    entry: {
        app: path.join(srcPath, 'index.ts')
    },
    resolve: {
        extensions: ['', '.js', '.ts'],
        modulesDirectories: ['../node_modules']
    },
    output: {
        path: path.join(__dirname, '..', 'build', 'frontend'),
        publicPath: '',
        filename: '[name].js',
        pathInfo: true
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader?transpileOnly=false' }
        ]
    },
    ts: {
        files: [
            'src/index.ts'
        ],
        compilerOptions: {
            declaration: false,
            noEmit: false,
            noEmitOnError: false
        }
    },
    debug: true,
    devtool: 'source-map'
};
