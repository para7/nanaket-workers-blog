import type { IRepositories } from "../repositories";
import { NotFoundError } from "../types/errors";
import {
	type CommentInput,
	validateCommentInput,
} from "../validators/comment.validator";

// Usecase Interface
export interface ICommentsUsecase {
	createComment(input: CommentInput): Promise<string>;
}

// Usecase関数（関数型アプローチ）
export const commentsUsecase = (
	repositories: IRepositories,
): ICommentsUsecase => ({
	createComment: async (input: CommentInput) => {
		// バリデーション（ValidationErrorをthrow）
		const validated = validateCommentInput(input);

		// 記事存在確認 (slug-based)
		const post = await repositories.posts.findBySlug(validated.postSlug);
		if (!post) {
			throw new NotFoundError("指定された記事が見つかりません");
		}

		// コメント挿入 (slug-based)
		await repositories.comments.create({
			postSlug: validated.postSlug,
			nickname: validated.nickname,
			content: validated.content,
			ipAddress: validated.ipAddress,
			sessionId: validated.sessionId,
		});

		// 成功時は記事のslugを返す（リダイレクト用）
		return post.slug;
	},
});
