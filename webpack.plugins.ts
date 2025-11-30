import { DefinePlugin } from 'webpack';
import type { WebpackPluginInstance } from 'webpack';

//LEAVE IMPORT AS RELATIVE PATH. DO NOT CONVERT TO ALIAS.
import {appVariantFromEnv} from "./buildSrc/appVariantFromEnv";
import {formatTimeStamp} from "./buildSrc/formatTimeStamp";
import {readCommitShortSHA, readCommitFullSHA} from "./buildSrc/readCommitSHA";
import {readAndValidateSemver} from "./buildSrc/readSemVer";

export const plugins: WebpackPluginInstance[] = [
  new DefinePlugin({
    __APP_VARIANT__: JSON.stringify(appVariantFromEnv()),
    __APP_BUILD_VERSION__: JSON.stringify(readAndValidateSemver(`version.${appVariantFromEnv()}`)),
    __APP_BUILD_COMMIT_SHORT_SHA__: JSON.stringify(readCommitShortSHA()),
    __APP_BUILD_COMMIT_FULL_SHA__: JSON.stringify(readCommitFullSHA()),
    __APP_BUILD_TIMESTAMP__: JSON.stringify(formatTimeStamp(new Date(Date.now())))
  }),
];
