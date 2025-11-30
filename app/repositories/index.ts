import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../../drizzle/schema";
import {
	commentsRepository,
	type ICommentsRepository,
} from "./comments.repository";
import { type IPostsRepository, postsRepository } from "./posts.repository";

// Client型の定義
export type Client = DrizzleD1Database<typeof schema>;

// すべてのRepositoryをまとめるインターフェース
export interface IRepositories {
	posts: IPostsRepository;
	comments: ICommentsRepository;
}

// Repositoriesファクトリ関数
export const repositories = (client: Client): IRepositories => ({
	posts: postsRepository(client),
	comments: commentsRepository(client),
});
