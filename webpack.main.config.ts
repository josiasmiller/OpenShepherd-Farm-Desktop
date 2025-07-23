import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import CopyPlugin from "copy-webpack-plugin";

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
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
      new CopyPlugin({
        patterns: [
            { from: 'src/main/assets', to: 'assets' }
        ]
      })
    ]
  ),
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
