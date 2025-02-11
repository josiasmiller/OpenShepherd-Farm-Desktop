const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "../src/renderer");
const destDir = path.join(__dirname, "../dist/renderer");

// Ensure destination directories exist
fs.mkdirSync(destDir, { recursive: true });

// Copy pages directory
fs.cpSync(path.join(srcDir, "pages"), path.join(destDir, "pages"), { recursive: true });

// Copy styles.css
fs.copyFileSync(path.join(srcDir, "styles.css"), path.join(destDir, "styles.css"));

console.log("Assets copied successfully!");
