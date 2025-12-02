import { showRoutes } from "hono/dev";
import { createMiddleware } from "hono/factory";
import { createApp } from "honox/server";
import { getDb } from "./lib/db";
import { repositories } from "./repositories";
import { usecases } from "./usecases";

// 依存性注入ミドルウェア
export const setup = createMiddleware(async (c, next) => {
	// DB接続
	const db = getDb(c);

	// Assets Fetcher取得（本番環境のみ利用可能）
	const assets = c.env.ASSETS;

	// ベースURL取得（開発環境用フォールバック）
	const url = new URL(c.req.url);
	const baseUrl = url.origin;

	// Repositories生成
	const repos = repositories(db, assets, baseUrl);

	// Usecases生成
	const cases = usecases(repos);

	// Contextに設定（usecasesのみ）
	c.set("usecases", cases);

	await next();
});

const app = createApp({
	init(app) {
		// 依存性注入ミドルウェアを適用
		app.use("*", setup);
	},
});

showRoutes(app);

export default app;
