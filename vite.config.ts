import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig(({ mode }) => {
	// Use different base paths for development and production
	const base =
		mode === "production"
			? "./" // Change this to your production path
			: "/"; // In development, use root path

	return {
		server: {
			proxy: {
				"/api": {
					target: "http://127.0.0.1:3000/plugins/pages/my_plugin.my_plugin-api/",
					changeOrigin: true,
				},
			},
		},
		resolve: { tsconfigPaths: true },
		plugins: [devtools(), tailwindcss(), viteReact(), tanstackRouter()],
		build: {
			outDir: resolve(__dirname, "my_plugin", "Pages"),
			emptyOutDir: true,
			rollupOptions: {
				input: {
					index: resolve(__dirname, "src", "index.html"),
				},
			},
		},
		root: "src",
		base,
	};
});

export default config;
