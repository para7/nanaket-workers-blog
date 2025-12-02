import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Plugin } from "vite";

interface PostMetadata {
	slug: string;
	title: string;
	publishedAt: string | null;
	description?: string;
	tags?: string[];
	category?: string;
	author?: string;
	filename: string;
	updatedAt: string;
}

interface PostsMetadata {
	posts: PostMetadata[];
	buildTime: string;
	totalCount: number;
}

export function postsPlugin(): Plugin {
	return {
		name: "vite-plugin-posts",
		apply: "build",

		async buildStart() {
			const contentDir = path.resolve(process.cwd(), "content/posts");
			const distDataDir = path.resolve(process.cwd(), "dist/data");
			const distPostsDir = path.resolve(distDataDir, "posts");

			// content/postsディレクトリが存在しない場合は空のメタデータを生成
			if (!fs.existsSync(contentDir)) {
				console.warn(
					"[vite-plugin-posts] content/posts directory not found. Creating empty metadata.",
				);
				fs.mkdirSync(distDataDir, { recursive: true });
				const emptyMetadata: PostsMetadata = {
					posts: [],
					buildTime: new Date().toISOString(),
					totalCount: 0,
				};
				fs.writeFileSync(
					path.join(distDataDir, "posts-metadata.json"),
					JSON.stringify(emptyMetadata, null, 2),
				);
				return;
			}

			// dist/data/posts ディレクトリを作成
			fs.mkdirSync(distPostsDir, { recursive: true });

			// content/posts/*.md を読み取り
			const files = fs
				.readdirSync(contentDir)
				.filter((file) => file.endsWith(".md"));

			const posts: PostMetadata[] = [];

			for (const filename of files) {
				const filePath = path.join(contentDir, filename);
				const fileContent = fs.readFileSync(filePath, "utf-8");

				// frontmatter をパース
				const { data: frontmatter } = matter(fileContent);

				// バリデーション
				const errors: string[] = [];

				// 必須フィールドのチェック
				if (!frontmatter.title || typeof frontmatter.title !== "string") {
					errors.push(`${filename}: title is required and must be a string`);
				}
				if (!frontmatter.slug || typeof frontmatter.slug !== "string") {
					errors.push(`${filename}: slug is required and must be a string`);
				}

				// slug とファイル名の一致チェック
				const expectedSlug = path.basename(filename, ".md");
				if (frontmatter.slug !== expectedSlug) {
					errors.push(
						`${filename}: slug "${frontmatter.slug}" must match filename "${expectedSlug}"`,
					);
				}

				// publishedAt の形式チェック（nullまたは有効なISO8601）
				if (
					frontmatter.publishedAt !== null &&
					frontmatter.publishedAt !== undefined
				) {
					const date = new Date(frontmatter.publishedAt);
					if (Number.isNaN(date.getTime())) {
						errors.push(
							`${filename}: publishedAt must be a valid ISO8601 datetime or null`,
						);
					}
				}

				if (errors.length > 0) {
					throw new Error(
						`[vite-plugin-posts] Validation errors:\n${errors.join("\n")}`,
					);
				}

				// ファイルの最終更新日時を取得
				const stats = fs.statSync(filePath);

				// メタデータを構築
				posts.push({
					slug: frontmatter.slug,
					title: frontmatter.title,
					publishedAt: frontmatter.publishedAt || null,
					description: frontmatter.description,
					tags: frontmatter.tags,
					category: frontmatter.category,
					author: frontmatter.author,
					filename,
					updatedAt: stats.mtime.toISOString(),
				});

				// Markdownファイルを dist/data/posts/ にコピー
				const destPath = path.join(distPostsDir, filename);
				fs.copyFileSync(filePath, destPath);
			}

			// メタデータJSONを生成
			const metadata: PostsMetadata = {
				posts,
				buildTime: new Date().toISOString(),
				totalCount: posts.length,
			};

			fs.writeFileSync(
				path.join(distDataDir, "posts-metadata.json"),
				JSON.stringify(metadata, null, 2),
			);

			console.log(
				`[vite-plugin-posts] Generated metadata for ${posts.length} posts`,
			);
		},
	};
}
