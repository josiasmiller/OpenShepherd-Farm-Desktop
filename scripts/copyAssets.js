import { mkdirSync, cpSync, copyFileSync } from 'fs';
import { join } from 'path';

// Helper function to handle errors and exit early
const exitOnError = (message, error) => {
  console.error(message);
  console.error(error);
  process.exit(1);  // Exit the script with a non-zero exit code to indicate failure
};

// Paths to source and destination folders
const srcRenderer = join('src', 'renderer');
const destRenderer = join('dist', 'renderer');

// Ensure destination directory exists
try {
  mkdirSync(destRenderer, { recursive: true });
  console.log("Created/Ensured directory: " + destRenderer);
} catch (err) {
  exitOnError("Error creating directory: " + destRenderer, err);
}

// Copy pages
try {
  const pagesSrc = join(srcRenderer, 'pages');
  const pagesDest = join(destRenderer, 'pages');
  cpSync(pagesSrc, pagesDest, { recursive: true });
  console.log("Copied pages successfully!");
} catch (err) {
  exitOnError("Error copying pages: ", err);
}

// Copy scripts
try {
  const scriptsSrc = join(srcRenderer, 'scripts');
  const scriptsDest = join(destRenderer, 'scripts');
  cpSync(scriptsSrc, scriptsDest, { recursive: true });
  console.log("Copied scripts successfully!");
} catch (err) {
  exitOnError("Error copying scripts: ", err);
}

// Copy styles directory (recursively copy all styles)
try {
  const stylesSrc = join(srcRenderer, 'styles');
  const stylesDest = join(destRenderer, 'styles');

  // Ensure the destination directory exists
  mkdirSync(stylesDest, { recursive: true });

  cpSync(stylesSrc, stylesDest, { recursive: true }); // Recursively copy all files
  console.log("Copied styles directory successfully!");
} catch (err) {
  exitOnError("Error copying styles directory: ", err);
}


console.log("Assets copied successfully!");
