const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const { MakerZIP } = require('@electron-forge/maker-zip');
const { MakerDMG } = require('@electron-forge/maker-dmg');
const { MakerDeb } = require('@electron-forge/maker-deb');
const { MakerSquirrel } = require('@electron-forge/maker-squirrel');

const iconPath = path.resolve(__dirname, 'src/assets/icon.icns');

/** @type {import('electron-forge').ForgeConfig} */
module.exports = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'src/assets/icon'),
    name: 'AnimalTrakker Farm Desktop',
    executableName: 'AnimalTrakker',
    appBundleId: 'com.animaltrakker.farmdesktop',
    appCategoryType: 'public.app-category.utilities', // mac specific categorization
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
};
