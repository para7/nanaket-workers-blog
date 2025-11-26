import { useState } from "hono/jsx";

export default function CommentForm({ postId }: { postId: number }) {
	const [nickname, setNickname] = useState("");
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setErrors([]);
		setIsSubmitting(true);

		try {
			// クライアントサイドバリデーション
			const validationErrors: string[] = [];

			if (!nickname || nickname.length < 1 || nickname.length > 50) {
				validationErrors.push("ニックネームは1-50文字で入力してください");
			}

			if (!content || content.length < 1 || content.length > 1000) {
				validationErrors.push("コメント内容は1-1000文字で入力してください");
			}

			if (validationErrors.length > 0) {
				setErrors(validationErrors);
				setIsSubmitting(false);
				return;
			}

			// APIにPOST
			const response = await fetch("/api/comments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postId,
					nickname,
					content,
				}),
			});

			const result = await response.json();

			if (result.success) {
				// 成功したらページをリロード
				window.location.reload();
			} else {
				setErrors(result.errors || ["コメントの投稿に失敗しました"]);
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error("Comment submission error:", error);
			setErrors(["コメントの投稿に失敗しました"]);
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<h3>コメントを投稿</h3>

			{errors.length > 0 && (
				<article style="background-color: var(--pico-del-color); border: 1px solid var(--pico-del-color);">
					<ul>
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</article>
			)}

			<form onSubmit={handleSubmit}>
				<label htmlFor="nickname">
					ニックネーム <abbr title="required">*</abbr>
					<input
						type="text"
						id="nickname"
						value={nickname}
						onInput={(e) => setNickname((e.target as HTMLInputElement).value)}
						maxLength={50}
						required
						disabled={isSubmitting}
						placeholder="名前を入力してください"
					/>
					<small>{nickname.length}/50文字</small>
				</label>

				<label htmlFor="content">
					コメント <abbr title="required">*</abbr>
					<textarea
						id="content"
						value={content}
						onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
						maxLength={1000}
						required
						disabled={isSubmitting}
						rows={4}
						placeholder="コメントを入力してください"
					/>
					<small>{content.length}/1000文字</small>
				</label>

				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "投稿中..." : "コメントを投稿"}
				</button>
			</form>
		</div>
	);
}
