const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const { MakerZIP } = require('@electron-forge/maker-zip');
const { MakerDMG } = require('@electron-forge/maker-dmg');
const { MakerDeb } = require('@electron-forge/maker-deb');
const { MakerSquirrel } = require('@electron-forge/maker-squirrel');
const WebpackPlugin = require('@electron-forge/plugin-webpack').default;

const iconPath = path.resolve(__dirname, 'src/assets/icon.icns');

console.log("MITCH DEBUG PATHS IN FORGE CONFIG");
console.log(__dirname);
console.log( path.resolve(__dirname, 'webpack.renderer.config.cjs'),);

const mainWebpackConfig = require('./webpack.main.config.cjs');
const rendererWebpackConfigPath = path.resolve(__dirname, 'webpack.renderer.config.cjs');


module.exports = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'src/assets/icon'),
    name: 'AnimalTrakker Farm Desktop',
    executableName: 'AnimalTrakker',
    appBundleId: 'com.animaltrakker.farmdesktop',
    appCategoryType: 'public.app-category.utilities',
    productName: 'AnimalTrakker',
  },
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
  plugins: [
    new WebpackPlugin({
      mainConfig: mainWebpackConfig,
      renderer: {
        config: rendererWebpackConfigPath,
        entryPoints: [
          {
            html: path.resolve(__dirname, 'src/renderer/index.html'),
            js: path.resolve(__dirname, 'src/renderer/main.tsx'),
            name: 'main_window',
            preload: {
              js: path.resolve(__dirname, 'src/main/preload.ts'),
            },
          },
        ],
      },
    }),

  ],
};
