import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  define: {
    'process.env.APP_VERSION_TYPE': JSON.stringify(process.env.APP_VERSION_TYPE || 'standard'),
  },
});
