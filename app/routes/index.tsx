import { createRoute } from "honox/factory";
import { createContainer } from "../lib/container";

export default createRoute(async (c) => {
	const { usecases } = createContainer(c);

	const postsList = await usecases.posts.getPublishedPosts();

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
