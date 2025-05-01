import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerDeb } from '@electron-forge/maker-deb';

console.log("mitch debug!!");
console.log(process.platform);

const config = {
  packagerConfig: {},
  makers: [
    new MakerSquirrel({}, ['win32']),  // Making for Windows platform
    new MakerZIP({}, ['win32']),       // ZIP for Windows
    new MakerDMG({}, ['darwin']),      // DMG for macOS
    new MakerDeb({}, ['linux']),       // DEB for Linux
  ],
};

export default config;
