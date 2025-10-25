import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    copyPublicDir: true, 
  },
  server: {
    proxy: {
      "/csrf": {
        target: "https://chatify-api.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "https://chatify-api.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
