import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";
import { setup } from "./middlewares";

const app = createApp({
	init(app) {
		// 依存性注入ミドルウェアを適用
		app.use("*", setup);
	},
});

showRoutes(app);

export default app;
