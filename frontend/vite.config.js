import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), compression()],
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    "react-vendor": ["react", "react-dom", "react-router-dom"],
                    "ui-vendor": ["react-icons"],
                },
            },
        },
        sourcemap: false,
    },
    server: {
        port: 5173,
        strictPort: true,
    },
});
