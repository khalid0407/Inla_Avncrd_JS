import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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