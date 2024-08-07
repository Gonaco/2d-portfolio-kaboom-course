import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        minify: "terser",
    },
    preview: {
        port: 8080,
        strictPort: true,
    },
    server: {
        port: 8080,
        strictPort: true,
        host: true,
        origin: "http://0.0.0.0:8080",
    },
});
