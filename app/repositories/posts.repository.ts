import type { Fetcher } from "@cloudflare/workers-types";
import matter from "gray-matter";

// 型定義
export type PostListItem = {
	title: string;
	slug: string;
	publishedAt: Date | null;
	description?: string;
	tags?: string[];
	category?: string;
};

export type PostDetail = {
	title: string;
	slug: string;
	content: string; // Markdown生テキスト
	publishedAt: Date | null;
	description?: string;
	tags?: string[];
	category?: string;
	author?: string;
};

// Interface定義
export interface IPostsRepository {
	findPublishedPosts(): Promise<PostListItem[]>;
	findBySlug(slug: string): Promise<PostDetail | null>;
}

// Repository関数（関数型アプローチ）
export const postsRepository = (
	assets: Fetcher | undefined,
	baseUrl?: string,
): IPostsRepository => ({
	findPublishedPosts: async () => {
		// /data/posts-metadata.json を fetch
		const url = new URL("/data/posts-metadata.json", baseUrl || "").toString();
		const response = assets ? await assets.fetch(url) : await fetch(url);

		if (!response.ok) {
			console.error("Failed to fetch posts metadata");
			return [];
		}

		const data = (await response.json()) as {
			posts: Array<{
				title: string;
				slug: string;
				publishedAt: string | null;
				description?: string;
				tags?: string[];
				category?: string;
			}>;
			buildTime: string;
			totalCount: number;
		};

		// publishedAt != null でフィルタし、publishedAt降順でソート
		return data.posts
			.filter((p) => p.publishedAt !== null)
			.map((p) => ({
				title: p.title,
				slug: p.slug,
				publishedAt: new Date(p.publishedAt as string),
				description: p.description,
				tags: p.tags,
				category: p.category,
			}))
			.sort(
				(a: PostListItem, b: PostListItem) =>
					(b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0),
			);
	},

	findBySlug: async (slug: string) => {
		try {
			// /data/posts/{slug}.md を fetch
			const url = new URL(`/data/posts/${slug}.md`, baseUrl || "").toString();
			const response = assets ? await assets.fetch(url) : await fetch(url);
			if (!response.ok) {
				return null;
			}

			const markdown = await response.text();

			// gray-matterでfrontmatterとcontentをパース
			const { data: frontmatter, content } = matter(markdown);

			return {
				title: frontmatter.title,
				slug: frontmatter.slug,
				content, // Markdown生テキスト
				publishedAt: frontmatter.publishedAt
					? new Date(frontmatter.publishedAt)
					: null,
				description: frontmatter.description,
				tags: frontmatter.tags,
				category: frontmatter.category,
				author: frontmatter.author,
			};
		} catch (error) {
			console.error(`Error fetching post ${slug}:`, error);
			return null;
		}
	},
});
