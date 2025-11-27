import { eq } from "drizzle-orm";
import { createRoute } from "honox/factory";
import { comments, posts } from "../../../drizzle/schema";
import { getDb } from "../../lib/db";
import { getCookie, setCookie } from "hono/cookie";

export const POST = createRoute(async (c) => {
	try {
		const body = await c.req.json();
		const { postId, nickname, content } = body;

		// IPアドレスを取得 (Cloudflare Workers環境)
		const ipAddress =
			c.req.header("CF-Connecting-IP") ||
			c.req.header("X-Forwarded-For") ||
			c.req.header("X-Real-IP") ||
			null;

		// セッションIDを取得または生成
		let sessionId = getCookie(c, "session_id");
		if (!sessionId) {
			sessionId = crypto.randomUUID();
			// Cookieに保存 (1年間有効)
			setCookie(c, "session_id", sessionId, {
				path: "/",
				maxAge: 60 * 60 * 24 * 365, // 1年
				httpOnly: true,
				secure: true,
				sameSite: "Lax",
			});
		}

		// バリデーション
		const errors: string[] = [];

		if (!postId || typeof postId !== "number") {
			errors.push("記事IDが不正です");
		}

		if (!nickname || typeof nickname !== "string") {
			errors.push("ニックネームは必須です");
		} else if (nickname.length < 1 || nickname.length > 50) {
			errors.push("ニックネームは1-50文字で入力してください");
		}

		if (!content || typeof content !== "string") {
			errors.push("コメント内容は必須です");
		} else if (content.length < 1 || content.length > 1000) {
			errors.push("コメント内容は1-1000文字で入力してください");
		}

		if (errors.length > 0) {
			return c.json({ success: false, errors }, 400);
		}

		const db = getDb(c);

		// 記事が存在するか確認
		const postResult = await db
			.select({ id: posts.id, slug: posts.slug })
			.from(posts)
			.where(eq(posts.id, postId))
			.limit(1);

		if (postResult.length === 0) {
			return c.json(
				{ success: false, errors: ["指定された記事が見つかりません"] },
				404,
			);
		}

		const post = postResult[0];

		// コメントを挿入
		await db.insert(comments).values({
			postId,
			nickname,
			content,
			ipAddress,
			sessionId,
		});

		return c.json({
			success: true,
			redirectTo: `/posts/${post.slug}`,
		});
	} catch (error) {
		console.error("Comment submission error:", error);
		return c.json(
			{ success: false, errors: ["コメントの投稿に失敗しました"] },
			500,
		);
	}
});
