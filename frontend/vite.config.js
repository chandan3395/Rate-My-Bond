import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function manualChunks(id) {
  if (id.includes("node_modules")) {
    if (id.includes("node_modules/firebase/") || id.includes("node_modules/@firebase/")) {
      return "firebase";
    }

    if (
      id.includes("node_modules/react/") ||
      id.includes("node_modules/react-dom/") ||
      id.includes("node_modules/react-router-dom/")
    ) {
      return "vendor";
    }
  }

  return undefined;
}

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
});
