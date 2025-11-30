import { createRoute } from "honox/factory";
import CommentForm from "../../components/CommentForm";
import { createContainer } from "../../lib/container";
import { NotFoundError } from "../../types/errors";

export default createRoute(async (c) => {
	const slug = c.req.param("slug");

	if (!slug) {
		return c.notFound();
	}

	const { usecases } = createContainer(c);

	try {
		const viewModel = await usecases.posts.getPostDetailBySlug(slug);
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
				<nav>
					<ul>
						<li>
							<a href="/">← 記事一覧に戻る</a>
						</li>
					</ul>
				</nav>

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

					{postComments.length > 0 && (
						<div>
							{postComments.map((comment) => (
								<article key={comment.id}>
									<header>
										<strong>{comment.nickname}</strong>{" "}
										<small>
											<time>
												{new Date(comment.createdAt).toLocaleString("ja-JP")}
											</time>
										</small>
									</header>
									<p style="white-space: pre-wrap">{comment.content}</p>
								</article>
							))}
						</div>
					)}

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
