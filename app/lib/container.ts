import type { Context } from "hono";
import { type IRepositories, repositories } from "../repositories";
import { type IUsecases, usecases } from "../usecases";
import { getDb } from "./db";

// コンテナ生成（関数型合成）
export function createContainer(c: Context) {
	const db = getDb(c);
	const repos = repositories(db);
	const cases = usecases(repos);

	return { repositories: repos, usecases: cases };
}

export type Container = ReturnType<typeof createContainer>;
export type { IRepositories, IUsecases };
