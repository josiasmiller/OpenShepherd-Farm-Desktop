import type { ForgeConfig } from '@electron-forge/shared-types';
import {MakerZIP} from '@electron-forge/maker-zip';
import {MakerDMG} from '@electron-forge/maker-dmg';
import {MakerDeb} from '@electron-forge/maker-deb';
import {MakerSquirrel} from '@electron-forge/maker-squirrel';
import {VitePlugin} from '@electron-forge/plugin-vite';
import path from 'path';

const iconPath = path.resolve(__dirname, 'src/assets/icon.icns');

const config: ForgeConfig = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'src/assets/icon'),
    name: 'AnimalTrakkerFarmDesktop',
    executableName: 'animaltrakker_farm_desktop',
    appBundleId: 'com.animaltrakker.farmdesktop',
    appCategoryType: 'public.app-category.utilities', // mac specific categorization
  },
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/main/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
  makers: [
    new MakerZIP({}),
    new MakerSquirrel({
      name: 'AnimalTrakker',
      setupIcon: path.resolve(__dirname, 'src/assets/icon.ico'),
      iconUrl: 'https://example.com/path/to/icon.ico',
      authors: 'AnimalTrakker',
      description: 'AnimalTrakker',
      exe: 'AnimalTrakker.exe',
    }, ['win32']),
    new MakerDMG({
      icon: iconPath,
    }, ['darwin']),
    new MakerDeb({
      options: {
        icon: path.resolve(__dirname, 'src/assets/AnimalTrakker_icon_512x512.png')
      }
    }, ['linux']),
  ],
};

export default config;
