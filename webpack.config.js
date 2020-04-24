const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin=require('copy-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: {
    app: './src/main.js',
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8082,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
         from: __dirname + '/static',
         to: __dirname + '/dist',
      }
   ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, './hololux/src'),
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', {
                modules: false,
              }],
              'react',
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[path]_[name]_[local]_[hash:base64:5]',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './postcss.config.js',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader-loader',
        options: {
          glsl: {
            chunkPath: path.resolve(__dirname, 'src/shaders/chunks'),
          },
        },
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/'), // 输出到dist目录，本项目的网页
  },
  node: {
    fs: 'empty',
  },
};


