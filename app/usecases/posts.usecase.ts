import { marked } from "marked";
import type { IRepositories } from "../repositories";
import type { Comment } from "../repositories/comments.repository";
import type {
	PostDetail,
	PostListItem,
} from "../repositories/posts.repository";
import { NotFoundError } from "../types/errors";

export type PostDetailWithHtml = PostDetail & {
	htmlContent: string;
};

export type PostDetailViewModel = {
	post: PostDetailWithHtml;
	comments: Comment[];
};

// Usecase Interface
export interface IPostsUsecase {
	getPublishedPosts(): Promise<PostListItem[]>;
	getPostDetailBySlug(slug: string): Promise<PostDetailViewModel>;
}

// Usecase関数（関数型アプローチ）
export const postsUsecase = (repositories: IRepositories): IPostsUsecase => ({
	getPublishedPosts: async () => {
		return await repositories.posts.findPublishedPosts();
	},

	getPostDetailBySlug: async (slug: string) => {
		const post = await repositories.posts.findBySlug(slug);
		if (!post) {
			throw new NotFoundError("記事が見つかりません");
		}

		// Markdownレンダリング（ビジネスロジック）
		const htmlContent = await marked(post.content);

		// コメント取得
		const comments = await repositories.comments.findByPostId(post.id);

		return {
			post: {
				...post,
				htmlContent,
			},
			comments,
		};
	},
});
