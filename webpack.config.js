const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app.js',  // app.js sebagai entry point
  output: {
    filename: 'bundle.js',  // hasil build disimpan di dist/bundle.js
    path: path.resolve(__dirname, 'dist'),
    clean: true, // membersihkan folder dist sebelum build baru
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // ambil template HTML Anda
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
  },
  mode: 'development', // default
};
