import { mkdirSync, cpSync } from 'fs';
import { join } from 'path';

// Helper function to handle errors and exit early
const exitOnError = (message, error) => {
  console.error(message);
  console.error(error);
  process.exit(1);  // Exit the script with a non-zero exit code to indicate failure
};

// Paths to source and destination folders
const srcRenderer = join('src', 'renderer');
const destRenderer = join('dist', 'src', 'renderer');

// Ensure destination directory exists
try {
  mkdirSync(destRenderer, { recursive: true });
  console.log("Created/Ensured directory: " + destRenderer);
} catch (err) {
  exitOnError("Error creating directory: " + destRenderer, err);
}

// Copy pages
try {
  cpSync(srcRenderer, destRenderer, { recursive: true });
  console.log("Copied renderer content successfully!");
} catch (err) {
  exitOnError("Error copying pages: ", err);
}

console.log("Assets copied successfully!");
