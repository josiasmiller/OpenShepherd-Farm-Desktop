import type { ForgeConfig, ResolvedForgeConfig } from '@electron-forge/shared-types';
import { exec } from 'child_process'
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerWix } from "@electron-forge/maker-wix";
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { fromBuildIdentifier } from "@electron-forge/core/dist/util/forge-config";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import path from "path";

//LEAVE IMPORT AS RELATIVE PATH. DO NOT CONVERT TO ALIAS.
import { appVariantFromEnv } from "./buildSrc/appVariantFromEnv";

//LEAVE IMPORT AS RELATIVE PATH. DO NOT CONVERT TO ALIAS.
import { readAndValidateSemver } from "./buildSrc/readSemVer";

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

function capitalize(str: string): string {
    if (str.length === 0) {
        return ""
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const isDevelopment = process.env.NODE_ENV?.trim() === "development";
const rendererHtmlPath = isDevelopment ? './src/renderer/root/index.dev.html' : './src/renderer/root/index.html'

const buildIdentifier = appVariantFromEnv()

const buildAuthor = 'AnimalTrakker'
const launchIconPath = path.resolve(__dirname, 'packaging', buildIdentifier, 'icons', 'ic_launcher');

const buildPackageName = `animaltrakker-${buildIdentifier}-desktop`
const buildAppVersion = readAndValidateSemver(`version.${buildIdentifier}`)

const buildDisplayName = fromBuildIdentifier({
    farm: 'AnimalTrakker Farm',
    registry: 'AnimalTrakker Registry'
}).map[buildIdentifier]

const buildShortDisplayName = fromBuildIdentifier({
    farm: 'AnimalTrakkerFarm',
    registry: 'AnimalTrakkerRegistry'
}).map[buildIdentifier]

const buildDescription = fromBuildIdentifier({
    farm: 'AnimalTrakker Farm',
    registry: 'AnimalTrakker Registry'
}).map[buildIdentifier]

const execBuildPackagesScript = (hookName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(`tsc -b ./src/packages/tsconfig.json`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Build packages failed in ${hookName} hook: ${error}`)
      } else {
        console.log(`Build packages finished in ${hookName} hook.`)
      }
      if (stdout) {
        console.log(`stdout: ${stdout}`)
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
      }
      if (error) {
        return reject(error)
      }
      resolve()
    })
  })
}

const config: ForgeConfig = {
    buildIdentifier: buildIdentifier,
    rebuildConfig: {},
    packagerConfig: {
        asar: true,
        junk: true,
        prune: true, //enable node module tree shaking, specifically devDependencies
        icon: launchIconPath,
        name: fromBuildIdentifier({
            farm: 'AnimalTrakker Farm',
            registry: 'AnimalTrakker Registry'
        }).map[buildIdentifier],
        executableName: buildPackageName,
        appBundleId: fromBuildIdentifier({
            farm: 'com.animaltrakker.farmdesktop',
            registry: 'com.animaltrakker.registrydesktop'
        }).map[buildIdentifier],
        appVersion: buildAppVersion,
        appCategoryType: 'public.app-category.utilities', // mac specific categorization
    },
    hooks: {
      preStart: async (config: ResolvedForgeConfig) => {
        await execBuildPackagesScript('preStart')
      },
      prePackage: async (
        config: ResolvedForgeConfig,
        platform: string,
        arch: string
      ) => {
        await execBuildPackagesScript('prePackage')
      },
      readPackageJson: async (
        forgeConfig: ResolvedForgeConfig,
        packageJson: Record<string,any>
      ) => {
        //The package.json name is required to be set,
        //but package.json is not normally dynamic,
        //so we write it based on the app variant here.
        packageJson.name = buildPackageName
        packageJson.productName = buildDisplayName
        packageJson.description = buildDescription
        packageJson.author = buildAuthor
        packageJson.version = buildAppVersion
        return packageJson
      },
    },
    makers: [
        new MakerZIP({}),
        new MakerSquirrel({
            name: buildPackageName,
            setupIcon: path.resolve(__dirname, 'packaging', buildIdentifier, 'icons', 'ic_launcher.ico'),
            authors: buildAuthor,
            description: buildDescription,
        }, ['win32']),
        new MakerWix({
            exe: buildPackageName,
            name: buildDisplayName,
            shortName: buildShortDisplayName,
            version: buildAppVersion,
            icon: path.resolve(__dirname, 'packaging', buildIdentifier, 'icons', 'ic_launcher.ico'),
            manufacturer: buildAuthor,
            description: buildDescription
        }, ['win32']),
        new MakerDMG((targetArch) => {
            return {
                icon: path.resolve(__dirname, 'packaging', 'common', 'null_file'), //reference empty file to force electron forge to fall back to default mac volumne icon
                iconSize: 72, //Do not set icon path here as it refers to the icon at the top of the DMG window, which defaults to the application icon
                background: path.resolve(__dirname, 'packaging', buildIdentifier, 'images', 'installer_dmg_background.png'),
                //Icon x,y placement is based on the installer_dmg_background.png file's contents and a 540 x 360 pt window
                //which is the default for electron dmg makers.
                contents: [
                    { x: 112, y: 274, type: "file", path: path.resolve(__dirname, 'out', buildIdentifier, `AnimalTrakker ${capitalize(buildIdentifier)}-darwin-${targetArch}`, `AnimalTrakker ${capitalize(buildIdentifier)}.app`) },
                    { x: 428, y: 274, type: "link", path: "/Applications" },
                    { x: 3000, y: 100, type: "position", path: ".background" },
                    { x: 3000, y: 100, type: "position", path: ".VolumeIcon.icns" }
                ],
                format: 'ULFO',
                overwrite: true
            }
        }, ['darwin']),
        new MakerDeb({
            options: {
                icon: path.resolve(__dirname, 'packaging', buildIdentifier, 'icons', 'ic_launcher.png'),
                genericName: buildDisplayName,
                description: buildDescription,
                productDescription: buildDescription,
                maintainer: buildAuthor,
            }
        }, ['linux']),
    ],
    plugins: [
        new AutoUnpackNativesPlugin({}),
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                  {
                    name: 'landing_window',
                    html: rendererHtmlPath,
                    js: './src/renderer/landing/index.tsx',
                    preload: {
                      js: './src/preload/preload.landing.ts'
                    }
                  },
                  {
                    html: rendererHtmlPath,
                    js: './src/renderer/index.tsx',
                    name: 'session_window',
                    preload: {
                      js: './src/preload/preload.session.ts',
                    },
                  },
                  {
                    name: 'about_window',
                    html: rendererHtmlPath,
                    js: './src/renderer/about/index.tsx',
                    preload: {
                      js: './src/preload/preload.about.ts',
                    }
                  }
                ],
            },
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;
