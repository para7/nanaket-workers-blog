// import { getCookie, setCookie } from "hono/cookie";
// import { createRoute } from "honox/factory";
// import { NotFoundError, ValidationError } from "../../types/errors";

// export const POST = createRoute(async (c) => {
// 	try {
// 		const formData = await c.req.formData();
// 		const postIdStr = formData.get("postId") as string;
// 		const nickname = formData.get("nickname") as string;
// 		const content = formData.get("content") as string;

// 		// IPアドレスを取得 (Cloudflare Workers環境)
// 		const ipAddress =
// 			c.req.header("CF-Connecting-IP") ||
// 			c.req.header("X-Forwarded-For") ||
// 			c.req.header("X-Real-IP") ||
// 			null;

// 		// セッションIDを取得または生成
// 		let sessionId = getCookie(c, "session_id");
// 		if (!sessionId) {
// 			sessionId = crypto.randomUUID();
// 			// Cookieに保存 (1年間有効)
// 			setCookie(c, "session_id", sessionId, {
// 				path: "/",
// 				maxAge: 60 * 60 * 24 * 365, // 1年
// 				httpOnly: true,
// 				secure: true,
// 				sameSite: "Lax",
// 			});
// 		}

// 		// Usecaseを呼び出し（ValidationError or NotFoundErrorがthrowされる可能性）
// 		const postSlug = await c.var.usecases.comments.createComment({
// 			postIdStr,
// 			nickname,
// 			content,
// 			ipAddress,
// 			sessionId,
// 		});

// 		// 成功時
// 		return c.redirect(`/posts/${postSlug}?success=1`);
// 	} catch (error) {
// 		// バリデーションエラー
// 		if (error instanceof ValidationError) {
// 			const formData = await c.req.formData();
// 			const postIdStr = formData.get("postId") as string;
// 			const nickname = formData.get("nickname") as string;
// 			const content = formData.get("content") as string;

// 			const errorParam = encodeURIComponent(error.errors.join("|"));
// 			return c.redirect(
// 				`/posts/${postIdStr}?error=${errorParam}&nickname=${encodeURIComponent(nickname || "")}&content=${encodeURIComponent(content || "")}`,
// 			);
// 		}

// 		// 記事が見つからない
// 		if (error instanceof NotFoundError) {
// 			const errorParam = encodeURIComponent(error.message);
// 			return c.redirect(`/?error=${errorParam}`);
// 		}

// 		// 予期しないエラー
// 		console.error("Comment submission error:", error);
// 		const errorParam = encodeURIComponent("コメントの投稿に失敗しました");
// 		return c.redirect(`/?error=${errorParam}`);
// 	}
// });
