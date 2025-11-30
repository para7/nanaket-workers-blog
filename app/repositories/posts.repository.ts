import { desc, eq, isNotNull } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../../drizzle/schema";
import { posts } from "../../drizzle/schema";

// 型定義
export type PostListItem = {
	id: number;
	title: string;
	slug: string;
	publishedAt: Date | null;
};

export type PostDetail = typeof posts.$inferSelect;

// Interface定義
export interface IPostsRepository {
	findPublishedPosts(): Promise<PostListItem[]>;
	findBySlug(slug: string): Promise<PostDetail | null>;
	findById(id: number): Promise<Pick<PostDetail, "id" | "slug"> | null>;
}

// Repository関数（関数型アプローチ）
export const postsRepository = (
	db: DrizzleD1Database<typeof schema>,
): IPostsRepository => ({
	findPublishedPosts: async () => {
		return await db
			.select({
				id: posts.id,
				title: posts.title,
				slug: posts.slug,
				publishedAt: posts.publishedAt,
			})
			.from(posts)
			.where(isNotNull(posts.publishedAt))
			.orderBy(desc(posts.publishedAt));
	},

	findBySlug: async (slug: string) => {
		const result = await db
			.select()
			.from(posts)
			.where(eq(posts.slug, slug))
			.limit(1);

		return result[0] || null;
	},

	findById: async (id: number) => {
		const result = await db
			.select({ id: posts.id, slug: posts.slug })
			.from(posts)
			.where(eq(posts.id, id))
			.limit(1);

		return result[0] || null;
	},
});
