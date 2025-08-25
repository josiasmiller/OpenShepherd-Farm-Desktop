import { DefinePlugin } from 'webpack';
import type { WebpackPluginInstance } from 'webpack';
//LEAVE IMPORT AS RELATIVE PATH. DO NOT CONVERT TO ALIAS.
import {appVariantFromEnv} from "./buildSrc/appVariantFromEnv";

export const plugins: WebpackPluginInstance[] = [
  new DefinePlugin({
    __APP_VARIANT__: JSON.stringify(appVariantFromEnv())
  }),
];
