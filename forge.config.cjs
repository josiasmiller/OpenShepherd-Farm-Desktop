const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const { MakerZIP } = require('@electron-forge/maker-zip');
const { MakerDMG } = require('@electron-forge/maker-dmg');
const { MakerDeb } = require('@electron-forge/maker-deb');

const iconPath = path.resolve(__dirname, 'src/assets/icon.icns');

/** @type {import('electron-forge').ForgeConfig} */
module.exports = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'src/assets/icon')
  },
  makers: [
    new MakerZIP({}),
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

// module.exports = {
//   packagerConfig: {
//     icon: iconPath.replace(/\.icns$/, ''), // must NOT include extension
//     afterCopy: [
//       async (buildPath) => {
//         console.log('Starting afterCopy hook...');
//         if (process.platform === 'darwin' && fs.existsSync(iconPath)) {
//           const dest = path.join(buildPath, 'Contents', 'Resources', 'icon.icns');
//           await fsp.copyFile(iconPath, dest);
//           console.log('✅ Copied icon.icns to', dest);
//         }
//         console.log('afterCopy hook finished');
//       }
//     ]
//   },
//   makers: [
//     new MakerZIP({}),
//     new MakerDMG({
//       icon: iconPath, // This sets the icon in the DMG window
//     }, ['darwin']),
//     new MakerDeb({
//       options: {
//         icon: path.resolve(__dirname, 'src/assets/AnimalTrakker_icon_512x512.png')
//       }
//     }, ['linux']),
//   ],
// };

