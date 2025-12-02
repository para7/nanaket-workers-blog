import { eq, sql } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../../drizzle/schema";
import { viewcounts } from "../../drizzle/schema";

// 型定義
export type ViewCount = typeof viewcounts.$inferSelect;

// Interface定義
export interface IViewCountsRepository {
	findBySlug(slug: string): Promise<number>;
	increment(slug: string): Promise<void>;
}

// Repository実装
export const viewcountsRepository = (
	db: DrizzleD1Database<typeof schema>,
): IViewCountsRepository => ({
	findBySlug: async (slug: string) => {
		const result = await db
			.select({ count: viewcounts.count })
			.from(viewcounts)
			.where(eq(viewcounts.slug, slug))
			.limit(1);

		return result[0]?.count || 0;
	},

	increment: async (slug: string) => {
		// 既存レコードの確認
		const existing = await db
			.select()
			.from(viewcounts)
			.where(eq(viewcounts.slug, slug))
			.limit(1);

		if (existing.length > 0) {
			// 既存レコードを更新
			await db
				.update(viewcounts)
				.set({
					count: sql`${viewcounts.count} + 1`,
					updatedAt: new Date(),
				})
				.where(eq(viewcounts.slug, slug));
		} else {
			// 新規レコードを挿入
			await db.insert(viewcounts).values({
				slug,
				count: 1,
			});
		}
	},
});
