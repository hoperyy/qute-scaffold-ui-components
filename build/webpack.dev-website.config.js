const path = require('path')
const HtmlwebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const WebpackOnBuildPlugin = require('on-build-webpack')
const openBrowser = require('react-dev-utils/openBrowser')

const srcDir = process.env.srcDir ? process.env.srcDir : path.join(__dirname, '../project-template');

module.exports = {
  entry: {
    ['wdui-website/js/index']: path.resolve(path.resolve(srcDir, 'docs-template/website'), './index.js')
  },
  output: {
    path: path.resolve(path.resolve(__dirname), '../temp'),
    publicPath: '/',
    filename: '[name].[hash:8].js',
    chunkFilename: 'wdui-website/js/[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loaders: [{
          loader: 'vue-loader',
          options: {
            postcss: {
              plugins: [autoprefixer({browsers: ['> 1%', 'ie >= 9', 'iOS >= 6', 'Android >= 2.1']})]
            }
          }
        }]
      },
      {
        test: /\.(css|scss|sass)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(less)$/,
        loaders: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.md$/,
        use: 'raw-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|svg)(\?t=\d+)?$/,
        loaders: [{
          loader: 'url-loader?limit=8192&name=[name]-[hash].[ext]'
        }]
      }
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    port: 8091,
    host: '127.0.0.1',
    https: false,
    compress: true,
    hot: true
  },
  resolveLoader: {
    alias: {
      'scss-loader': 'sass-loader',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new HtmlwebpackPlugin({
      template: path.resolve(srcDir, 'docs-template/website/index.html'),
      filename: 'index.html',
      chunks: ['wdui-website/js/index'],
      inject: 'body'
    }),
    new webpack.ProvidePlugin({
      hljs: path.resolve(path.resolve(srcDir, 'docs-template/website'), './assets/js/highlight/highlight.pack.js')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackOnBuildPlugin(() => {
      // Do whatever you want...
      console.log('\ndevelop url: http://0.0.0.0:8091/#/\n');
      openBrowser('http://0.0.0.0:8091/#/');
    }),
  ]
}
