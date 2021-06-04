const webpackConfig = require('./webpack.config');

const { merge } = require('webpack-merge');

module.exports = merge(webpackConfig, {
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: ['node_modules/**'],
  },
});
