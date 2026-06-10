import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: true,
    proxy: {
      "/api": "http://127.0.0.1:3001",
      "/solana": {
        target: "http://127.0.0.1:8899",
        rewrite: (path) => path.replace(/^\/solana/, ""),
      },
      "/solana-ws": {
        target: "ws://127.0.0.1:8900",
        ws: true,
        rewrite: (path) => path.replace(/^\/solana-ws/, ""),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
