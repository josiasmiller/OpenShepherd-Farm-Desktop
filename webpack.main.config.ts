import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import CopyPlugin from "copy-webpack-plugin";
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
  //Disabling the cache to prevent a webpack 5 caching issue that prevents sqlite3 from being found on the first run.
  //https://github.com/electron/forge/issues/2412#issuecomment-1062106849
  cache: false,
  output: {
    library: {
        type: 'commonjs'
    }
  },
  // Put your normal webpack config below here
  module: {
    rules: rules.concat(
      [{
        test: /\.pdf/,
        type: 'asset/resource',
        generator: {
          filename: 'documents/[name][ext]'
        }
      }],
    )
  },
  plugins: plugins.concat(
    [
        new ForkTsCheckerWebpackPlugin({
          typescript: {
            build: false,
            configFile: 'src/main/tsconfig.json'
          }
        }),
        new CopyPlugin({
        patterns: [
          { from: 'src/main/assets', to: 'assets' }
        ]
      })
    ]
  ),
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    plugins: [new TsconfigPathsPlugin({})]
  },
};
