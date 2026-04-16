import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,      // Forzamos el 5174 siempre
    strictPort: true, // Si el 5174 está ocupado, dará error (así sabrás que hay algo raro)
    host: true,       // Permite que Windows vea el puerto de WSL sin problemas
    proxy: {
      "/sanctum": {
        target: "http://127.0.0.1:80", // Cambia 80 por el puerto de tu Laravel si es otro
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://127.0.0.1:80", // Cambia 80 por el puerto de tu Laravel
        changeOrigin: true,
        secure: false,
      },
    },
  },
});