import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Define the Vite configuration
export default defineConfig({
  plugins: [react()],
  // base: './',  // Ensure relative URLs for assets, useful for Electron packaging
  // root: path.resolve(__dirname, "src/renderer"), // The React source code directory
  build: {
    outDir: path.resolve(__dirname, "dist/renderer"),
    emptyOutDir: true,
    rollupOptions: {
      external: ['electron'],
    },
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
  server: {
    port: 5173, // Port for Vite's dev server
  },
});
