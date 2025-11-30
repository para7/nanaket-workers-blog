import type { ICommentsRepository } from "../repositories/comments.repository";
import type { IPostsRepository } from "../repositories/posts.repository";
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
	commentsRepo: ICommentsRepository,
	postsRepo: IPostsRepository,
): ICommentsUsecase => ({
	createComment: async (input: CommentInput) => {
		// バリデーション（ValidationErrorをthrow）
		const validated = validateCommentInput(input);

		// 記事存在確認
		const post = await postsRepo.findById(validated.postId);
		if (!post) {
			throw new NotFoundError("指定された記事が見つかりません");
		}

		// コメント挿入
		await commentsRepo.create({
			postId: validated.postId,
			nickname: validated.nickname,
			content: validated.content,
		});

		// 成功時は記事のslugを返す（リダイレクト用）
		return post.slug;
	},
});
