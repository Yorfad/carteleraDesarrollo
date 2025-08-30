import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/carteleraDesarrollo/",   // 👈 nombre del repo
  plugins: [react()],
});
