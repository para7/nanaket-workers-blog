import { asc, eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../../drizzle/schema";
import { comments } from "../../drizzle/schema";

// 型定義
export type Comment = typeof comments.$inferSelect;

export type CreateCommentInput = {
	postId: number;
	nickname: string;
	content: string;
};

// Interface定義
export interface ICommentsRepository {
	findByPostId(postId: number): Promise<Comment[]>;
	create(input: CreateCommentInput): Promise<void>;
}

// Repository関数（関数型アプローチ）
export const commentsRepository = (
	db: DrizzleD1Database<typeof schema>,
): ICommentsRepository => ({
	findByPostId: async (postId: number) => {
		return await db
			.select()
			.from(comments)
			.where(eq(comments.postId, postId))
			.orderBy(asc(comments.createdAt));
	},

	create: async (input: CreateCommentInput) => {
		await db.insert(comments).values({
			postId: input.postId,
			nickname: input.nickname,
			content: input.content,
		});
	},
});
