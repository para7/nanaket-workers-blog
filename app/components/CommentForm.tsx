type CommentFormProps = {
	postId: number;
	errors?: string[];
	nickname?: string;
	content?: string;
	success?: boolean;
};

export default function CommentForm({
	postId,
	errors = [],
	nickname = "",
	content = "",
	success = false,
}: CommentFormProps) {
	return (
		<div>
			<h3>コメントを投稿</h3>

			{success && (
				<article style="background-color: var(--pico-ins-color); border: 1px solid var(--pico-ins-color);">
					コメントを投稿しました
				</article>
			)}

			{errors.length > 0 && (
				<article style="background-color: var(--pico-del-color); border: 1px solid var(--pico-del-color);">
					<ul>
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</article>
			)}

			<form method="post" action="/api/comments">
				<input type="hidden" name="postId" value={postId} />

				<label htmlFor="nickname">
					ニックネーム <abbr title="required">*</abbr>
					<input
						type="text"
						id="nickname"
						name="nickname"
						value={nickname}
						maxLength={50}
						required
						placeholder="名前を入力してください"
					/>
				</label>

				<label htmlFor="content">
					コメント <abbr title="required">*</abbr>
					<textarea
						id="content"
						name="content"
						value={content}
						maxLength={1000}
						required
						rows={4}
						placeholder="コメントを入力してください"
					/>
				</label>

				<button type="submit">コメントを投稿</button>
			</form>
		</div>
	);
}
