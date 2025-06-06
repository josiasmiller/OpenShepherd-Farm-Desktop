const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src/main/main.ts'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/main'),
    libraryTarget: 'commonjs2',
  },
  target: 'electron-main',
  resolve: {
    extensions: ['.ts', '.cts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|cts)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_VERSION_TYPE': JSON.stringify(process.env.APP_VERSION_TYPE || 'standard'),
    }),
  ],
};
