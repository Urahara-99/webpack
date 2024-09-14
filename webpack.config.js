const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, 'js/index.js'),
    login: path.resolve(__dirname, 'js/login.js'),
    profile: path.resolve(__dirname, 'js/profile.js'),
    edit_profile: path.resolve(__dirname, 'js/edit_profile.js'),
    register: path.resolve(__dirname, 'js/register.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true,
    publicPath: '/',  
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/login\/?$/, to: '/login.html' },
        { from: /^\/profile\/?$/, to: '/profile.html' },
        { from: /^\/register\/?$/, to: '/register.html' },
        { from: /^\/edit_profile\/?$/, to: '/edit_profile.html' },
        { from: /^\/$/, to: '/index.html' },  
      ],
    },
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; connect-src 'self' http://localhost/guvi-task-1/;",
    },
    proxy: {
      '/css': 'http://localhost:3000',
      '/assets': 'http://localhost:3000',
    },  
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Index',
      filename: 'index.html',
      template: 'index.html',
      chunks: ['index'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      title: 'Login',
      filename: 'login.html',
      template: 'login.html',
      chunks: ['login'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      title: 'Profile',
      filename: 'profile.html',
      template: 'profile.html',
      chunks: ['profile'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      title: 'Register',
      filename: 'register.html',
      template: 'register.html',
      chunks: ['register'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      title: 'Edit Profile',
      filename: 'edit_profile.html',
      template: 'edit_profile.html',
      chunks: ['edit_profile'],
      inject: 'body',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'css', to: 'css' },
      ],
    }),
  ],
};
