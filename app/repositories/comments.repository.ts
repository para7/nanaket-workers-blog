import { asc, eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../../drizzle/schema";
import { comments } from "../../drizzle/schema";

// 型定義
export type Comment = typeof comments.$inferSelect;

export type CreateCommentInput = {
	postSlug: string;
	nickname: string;
	content: string;
	ipAddress?: string | null;
	sessionId?: string | null;
};

// Interface定義
export interface ICommentsRepository {
	findByPostSlug(postSlug: string): Promise<Comment[]>;
	create(input: CreateCommentInput): Promise<void>;
}

// Repository関数（関数型アプローチ）
export const commentsRepository = (
	db: DrizzleD1Database<typeof schema>,
): ICommentsRepository => ({
	findByPostSlug: async (postSlug: string) => {
		return await db
			.select()
			.from(comments)
			.where(eq(comments.postSlug, postSlug))
			.orderBy(asc(comments.createdAt));
	},

	create: async (input: CreateCommentInput) => {
		await db.insert(comments).values({
			postSlug: input.postSlug,
			nickname: input.nickname,
			content: input.content,
			ipAddress: input.ipAddress,
			sessionId: input.sessionId,
		});
	},
});
