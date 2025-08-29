import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

export const rendererConfig: Configuration = {
  module: {
    rules: rules.concat(
      [
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
        {
          test: /\.png/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name][ext]'
          }
        },
        {
          test: /\.ttf/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]'
          }
        }]
    ),
  },
  plugins: plugins.concat([
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        build: true,
        configFile: 'src/renderer/tsconfig.json'
      }
    }),
  ]),
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    plugins: [new TsconfigPathsPlugin({})]
  },
};
