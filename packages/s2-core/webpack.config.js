const webpack = require('webpack');
const resolve = require('path').resolve;
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  entry: {
    S2: './src/index.ts',
  },
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].min.js',
    library: 'S2',
    libraryTarget: 'commonjs2',
    path: resolve(__dirname, './dist'),
  },
  resolve: {
    alias: {
      src: path.resolve('./src'),
      '@': path.resolve('./src'),
    },
    extensions: ['.tsx', '.ts', '.js', '.json', '.less'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },
      {
        // svg-inline-loader, being uesed for handling svgs from iconfont.cn, which could convert svg to text type fragment like  '<svg><path d="${path}"></svg>'
        // 1. Being used for  image from gui-icon, like 'data:image/svg+xml;utf-8,<svg><path d="${path}"></svg>'
        // 2. Being used for jsx form html-cion, like dangerouslySetInnerHTML={{ __html: '<svg><path d="${path}"></svg>' }}
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-inline-loader',
            options: {
              removeTags: true,
              removingTags: ['defs'],
              removeSVGTagAttrs: true,
              removingTagAttrs: ['xmlns:xlink', 't', 'class', 'p-id', 'style'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    process.env.MODE === 'ANALYZER' && [
      new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    ],
  ].filter(Boolean),
  externals: {
    moment: 'moment',
    '../moment': 'moment',
    lodash: 'lodash',
    react: 'react',
    'react-dom': 'react-dom',
    antd: 'antd',
    '@ant-design/icons': 'AntDesignIcons',
  },
};
