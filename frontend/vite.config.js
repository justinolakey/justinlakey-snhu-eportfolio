import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This is the Vite configuration file for the frontend application.
// It sets up the development server and configures a proxy for API requests.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
            },
        },
    },
});
