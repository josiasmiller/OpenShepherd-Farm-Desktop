const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src/renderer/main.tsx'),
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist/renderer'),
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.cts'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|cts)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_VERSION_TYPE': JSON.stringify(process.env.APP_VERSION_TYPE || 'standard'),
    }),
  ],
};
