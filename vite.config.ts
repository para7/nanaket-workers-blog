import build from "@hono/vite-build/cloudflare-workers";
import adapter from "@hono/vite-dev-server/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { defineConfig } from "vite";
import { postsPlugin } from "./vite-plugin-posts";

export default defineConfig({
	plugins: [
		postsPlugin(),
		honox({
			devServer: { adapter },
			client: { input: ["/app/client.ts", "/app/style.css"] },
		}),
		tailwindcss(),
		build(),
	],
});
