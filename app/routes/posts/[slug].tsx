import { createRoute } from "honox/factory";
import BackToList from "../../components/BackToList";
import CommentForm from "../../components/CommentForm";
import CommentList from "../../components/CommentList";
import { NotFoundError } from "../../types/errors";

export default createRoute(async (c) => {
	const slug = c.req.param("slug");

	if (!slug) {
		return c.notFound();
	}

	try {
		const viewModel = await c.var.usecases.posts.getPostDetailBySlug(slug);
		const { post, comments: postComments } = viewModel;

		// クエリパラメータ処理（UIレイヤーの責務）
		const errorParam = c.req.query("error");
		const successParam = c.req.query("success");
		const nicknameParam = c.req.query("nickname") || "";
		const contentParam = c.req.query("content") || "";

		const errors = errorParam ? decodeURIComponent(errorParam).split("|") : [];
		const success = successParam === "1";

		return c.render(
			<div>
				<title>{post.title} - nanaket-workers-blog</title>
				<BackToList />

				<article>
					<header>
						<h1 class="text-5xl">{post.title}</h1>
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
					</header>

					<div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
				</article>

				<section>
					<h2>コメント ({postComments.length})</h2>

					<CommentList comments={postComments} />

					<CommentForm
						postId={post.id}
						errors={errors}
						nickname={nicknameParam}
						content={contentParam}
						success={success}
					/>
				</section>
			</div>,
		);
	} catch (error) {
		if (error instanceof NotFoundError) {
			return c.notFound();
		}
		throw error;
	}
});
