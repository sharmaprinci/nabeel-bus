import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    resolve: {
    alias: {
      jspdf: path.resolve(__dirname, "node_modules/jspdf"),
      "jspdf-autotable": path.resolve(__dirname, "node_modules/jspdf-autotable"),
    },
  },
  optimizeDeps: {
    include: ["jspdf", "jspdf-autotable"],
  },

})
