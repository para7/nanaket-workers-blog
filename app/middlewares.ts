import { createMiddleware } from "hono/factory";
import { getDb } from "./lib/db";
import { repositories } from "./repositories";
import { usecases } from "./usecases";

// 依存性注入ミドルウェア
export const setup = createMiddleware(async (c, next) => {
	// DB接続
	const db = getDb(c);

	// Repositories生成
	const repos = repositories(db);

	// Usecases生成
	const cases = usecases(repos);

	// Contextに設定（usecasesのみ）
	c.set("usecases", cases);

	await next();
});
