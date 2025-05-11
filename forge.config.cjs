const { MakerZIP } = require('@electron-forge/maker-zip');
const { MakerDMG } = require('@electron-forge/maker-dmg');
const { MakerDeb } = require('@electron-forge/maker-deb');

/** @type {import('electron-forge').ForgeConfig} */
module.exports = {
  packagerConfig: {},
  makers: [
    new MakerZIP({}, ['win32']),
    new MakerDMG({}, ['darwin']),
    new MakerDeb({}, ['linux']),
  ],
};
