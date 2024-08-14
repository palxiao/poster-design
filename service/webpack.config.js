/*
 * @Author: ShawnPhang
 * @Date: 2021-12-27 10:15:07
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-12-27 11:22:29
 */
'use strict'

const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const nodeExternals = require('webpack-node-externals');
const buildPlugin = require('./webpack.plugin.js');

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              // 指定特定的ts编译配置，为了区分脚本的ts配置
              configFile: path.resolve(__dirname, './tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  // plugins: [new BundleAnalyzerPlugin()],
  plugins: [ new buildPlugin() ]
}
