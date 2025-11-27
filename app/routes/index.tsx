import { desc, isNotNull } from "drizzle-orm";
import { createRoute } from "honox/factory";
import { posts } from "../../drizzle/schema";
import { getDb } from "../lib/db";

export default createRoute(async (c) => {
	const db = getDb(c);
	const postsList = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			publishedAt: posts.publishedAt,
		})
		.from(posts)
		.where(isNotNull(posts.publishedAt))
		.orderBy(desc(posts.publishedAt));

	return c.render(
		<div>
			<title>nanaket-workers-blog (test)</title>
			<h1>記事一覧</h1>
			{postsList.map((post) => (
				<article key={post.id}>
					<hgroup>
						<h2 class="text-4xl">
							<a href={`/posts/${post.slug}`}>{post.title}</a>
						</h2>
						{post.publishedAt && (
							<p>
								<time>
									{new Date(post.publishedAt).toLocaleDateString("ja-JP", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</time>
							</p>
						)}
					</hgroup>
				</article>
			))}
		</div>,
	);
});
