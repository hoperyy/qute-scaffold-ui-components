const path = require('path')
const HtmlwebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')

const srcDir = process.env.srcDir;
const distDir = process.env.distDir;

module.exports = {
  entry: {
    ['wdui-website/js/index']: path.resolve(path.resolve(srcDir, 'auto-completed-docs/website'), './index.js')
  },
  output: {
    // path: path.resolve(path.resolve(__dirname), '../temp'),
    path: path.resolve(distDir, 'website'),
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
          loader: 'url-loader?limit=8192&name=wdui-website/assets/[name]-[hash].[ext]'
        }]
      }
    ]
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
      template: path.resolve(srcDir, 'auto-completed-docs/website/index.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.ProvidePlugin({
      hljs: path.resolve(path.resolve(srcDir, 'auto-completed-docs/website'), './assets/js/highlight/highlight.pack.js')
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        warnings: false
      }
    })
  ]
}
