import { eq } from "drizzle-orm";
import { createRoute } from "honox/factory";
import { comments, posts } from "../../../drizzle/schema";
import { getDb } from "../../lib/db";

export const POST = createRoute(async (c) => {
	try {
		const formData = await c.req.formData();
		const postIdStr = formData.get("postId") as string;
		const nickname = formData.get("nickname") as string;
		const content = formData.get("content") as string;

		// バリデーション
		const errors: string[] = [];

		const postId = Number.parseInt(postIdStr, 10);
		if (!postIdStr || Number.isNaN(postId)) {
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

		const db = getDb(c);

		// 記事が存在するか確認
		const postResult = await db
			.select({ id: posts.id, slug: posts.slug })
			.from(posts)
			.where(eq(posts.id, postId))
			.limit(1);

		if (postResult.length === 0) {
			errors.push("指定された記事が見つかりません");
		}

		if (errors.length > 0) {
			const post = postResult[0];
			const errorParam = encodeURIComponent(errors.join("|"));
			return c.redirect(
				`/posts/${post?.slug || ""}?error=${errorParam}&nickname=${encodeURIComponent(nickname || "")}&content=${encodeURIComponent(content || "")}`,
			);
		}

		const post = postResult[0];

		// コメントを挿入
		await db.insert(comments).values({
			postId,
			nickname,
			content,
		});

		return c.redirect(`/posts/${post.slug}?success=1`);
	} catch (error) {
		console.error("Comment submission error:", error);
		const errorParam = encodeURIComponent("コメントの投稿に失敗しました");
		return c.redirect(`/?error=${errorParam}`);
	}
});
