import { createRoute } from "honox/factory";
import PostCard from "../components/PostCard";

export default createRoute(async (c) => {
	const postsList = await c.var.usecases.posts.getPublishedPosts();

	return c.render(
		<div>
			<title>nanaket-workers-blog (test)</title>
			<h1>記事一覧</h1>
			{postsList.map((post) => (
				<PostCard
					key={post.id}
					id={post.id}
					title={post.title}
					slug={post.slug}
					publishedAt={post.publishedAt}
				/>
			))}
		</div>,
	);
});
