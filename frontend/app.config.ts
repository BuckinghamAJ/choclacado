import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    server: {
      allowedHosts: ["frontend", "localhost", ".choclacado.com", "api"],
    },
    plugins: [tailwindcss()],
  },
});
