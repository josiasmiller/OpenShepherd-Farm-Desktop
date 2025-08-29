import type { ForgeConfig, ResolvedForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from "@electron-forge/maker-dmg";
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
//LEAVE IMPORT AS RELATIVE PATH. DO NOT CONVERT TO ALIAS.
import { appVariantFromEnv } from "./buildSrc/appVariantFromEnv";
import { fromBuildIdentifier } from "@electron-forge/core/dist/util/forge-config";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import path from "path";

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

function capitalize(str: string): string {
    if (str.length === 0) {
        return ""
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const isDevelopment = process.env.NODE_ENV?.trim() === "development";
const rendererHtmlPath = isDevelopment ? './src/renderer/index.dev.html' : './src/renderer/index.html'

const buildIdentifier = appVariantFromEnv()

const launchIconPath = path.resolve(__dirname, 'packaging', buildIdentifier, 'icons', 'ic_launcher');
const buildPackageName = `animaltrakker-${buildIdentifier}-desktop`

const buildDisplayName = fromBuildIdentifier({
    farm: 'AnimalTrakker Farm',
    registry: 'AnimalTrakker Registry'
}).map[buildIdentifier]

const buildDescription = fromBuildIdentifier({
    farm: 'AnimalTrakker Farm',
    registry: 'AnimalTrakker Registry'
}).map[buildIdentifier]

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
        appVersion: fromBuildIdentifier({
            farm: '0.0.1',
            registry: '0.0.1'
        }).map[buildIdentifier],
        appCategoryType: 'public.app-category.utilities', // mac specific categorization
    },
    hooks: {
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
            packageJson.author = 'AnimalTrakker'
            return packageJson
        },
    },
    makers: [
        new MakerZIP({}),
        new MakerSquirrel({
            name: buildPackageName,
            setupIcon: path.resolve(__dirname, 'packaging', buildIdentifier, 'icons', 'ic_launcher.ico'),
            authors: 'AnimalTrakker',
            description: buildDescription,
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
                maintainer: "AnimalTrakker",

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
                        html: rendererHtmlPath,
                        js: './src/renderer/index.tsx',
                        name: 'main_window',
                        preload: {
                            js: './src/main/preload.ts',
                        },
                    },
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
