import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
import path from "path";
export default defineConfig({
  plugins: [react(),
    // tailwindcss(),

  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
