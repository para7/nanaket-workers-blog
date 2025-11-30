import { createRoute } from "honox/factory";
import { NotFoundError, ValidationError } from "../../types/errors";

export const POST = createRoute(async (c) => {
	try {
		const formData = await c.req.formData();
		const postIdStr = formData.get("postId") as string;
		const nickname = formData.get("nickname") as string;
		const content = formData.get("content") as string;

		// Usecaseを呼び出し（ValidationError or NotFoundErrorがthrowされる可能性）
		const postSlug = await c.var.usecases.comments.createComment({
			postIdStr,
			nickname,
			content,
		});

		// 成功時
		return c.redirect(`/posts/${postSlug}?success=1`);
	} catch (error) {
		// バリデーションエラー
		if (error instanceof ValidationError) {
			const formData = await c.req.formData();
			const postIdStr = formData.get("postId") as string;
			const nickname = formData.get("nickname") as string;
			const content = formData.get("content") as string;

			const errorParam = encodeURIComponent(error.errors.join("|"));
			return c.redirect(
				`/posts/${postIdStr}?error=${errorParam}&nickname=${encodeURIComponent(nickname || "")}&content=${encodeURIComponent(content || "")}`,
			);
		}

		// 記事が見つからない
		if (error instanceof NotFoundError) {
			const errorParam = encodeURIComponent(error.message);
			return c.redirect(`/?error=${errorParam}`);
		}

		// 予期しないエラー
		console.error("Comment submission error:", error);
		const errorParam = encodeURIComponent("コメントの投稿に失敗しました");
		return c.redirect(`/?error=${errorParam}`);
	}
});
