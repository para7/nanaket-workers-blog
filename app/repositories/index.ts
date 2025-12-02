import type { Fetcher } from "@cloudflare/workers-types";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../../drizzle/schema";
import {
	commentsRepository,
	type ICommentsRepository,
} from "./comments.repository";
import { type IPostsRepository, postsRepository } from "./posts.repository";
import {
	type IViewCountsRepository,
	viewcountsRepository,
} from "./viewcounts.repository";

// Client型の定義
export type Client = DrizzleD1Database<typeof schema>;

// すべてのRepositoryをまとめるインターフェース
export interface IRepositories {
	posts: IPostsRepository;
	comments: ICommentsRepository;
	viewcounts: IViewCountsRepository;
}

// Repositoriesファクトリ関数
export const repositories = (
	client: Client,
	assets: Fetcher | undefined,
	baseUrl?: string,
): IRepositories => ({
	posts: postsRepository(assets, baseUrl),
	comments: commentsRepository(client),
	viewcounts: viewcountsRepository(client),
});
