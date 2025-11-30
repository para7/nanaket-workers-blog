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

		// 記事存在確認
		const post = await repositories.posts.findById(validated.postId);
		if (!post) {
			throw new NotFoundError("指定された記事が見つかりません");
		}

		// コメント挿入
		await repositories.comments.create({
			postId: validated.postId,
			nickname: validated.nickname,
			content: validated.content,
		});

		// 成功時は記事のslugを返す（リダイレクト用）
		return post.slug;
	},
});
