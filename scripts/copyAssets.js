import { mkdirSync, copyFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));

const srcDir = join(currentDir, '..', 'src', 'assets');
const destDir = join(currentDir, '..', 'dist', 'renderer', 'assets');

mkdirSync(destDir, { recursive: true });

readdirSync(srcDir).forEach(file => {
  copyFileSync(join(srcDir, file), join(destDir, file));
});
