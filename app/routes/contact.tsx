import { createRoute } from "honox/factory";

export default createRoute(async (c) => {
	const isSuccess = c.req.query("success") === "true";

	// POSTリクエストの処理
	if (c.req.method === "POST") {
		const formData = await c.req.parseBody();
		const name = formData.name as string;
		const email = formData.email as string;
		const message = formData.message as string;

		// バリデーション
		const errors: string[] = [];
		if (!name || name.trim().length === 0) {
			errors.push("お名前を入力してください");
		}
		if (!email || email.trim().length === 0) {
			errors.push("返信先メールアドレスを入力してください");
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.push("有効なメールアドレスを入力してください");
		}
		if (!message || message.trim().length === 0) {
			errors.push("お問い合わせ内容を入力してください");
		}

		if (errors.length > 0) {
			return c.render(
				<div>
					<title>Contact - nanaket-workers-blog</title>
					<h1>お問い合わせ</h1>

					<article>
						<div
							role="alert"
							style="background-color: var(--pico-del-color); padding: 1rem; border-radius: 0.25rem; margin-bottom: 1rem;"
						>
							<strong>エラーがあります：</strong>
							<ul style="margin-bottom: 0;">
								{errors.map((error) => (
									<li key={error}>{error}</li>
								))}
							</ul>
						</div>

						<form method="post" action="/contact">
							<label>
								お名前
								<input
									type="text"
									name="name"
									value={(formData.name as string) || ""}
									required
								/>
							</label>

							<label>
								返信先メールアドレス
								<input
									type="email"
									name="email"
									value={(formData.email as string) || ""}
									required
								/>
							</label>

							<label>
								お問い合わせ内容
								<textarea name="message" rows={8} required>
									{(formData.message as string) || ""}
								</textarea>
							</label>

							<button type="submit">送信</button>
						</form>
					</article>
				</div>,
			);
		}

		// 実際のアプリケーションでは、ここでメール送信やデータベース保存を行う
		// 今回は単純に成功ページにリダイレクト
		console.log("Contact form submitted:", { name, email, message });

		return c.redirect("/contact?success=true");
	}

	// GETリクエストの処理
	return c.render(
		<div>
			<title>Contact - nanaket-workers-blog</title>
			<h1>お問い合わせ</h1>

			{isSuccess ? (
				<article>
					<div
						role="alert"
						style="background-color: var(--pico-ins-color); padding: 1rem; border-radius: 0.25rem;"
					>
						<strong>送信完了</strong>
						<p>
							お問い合わせありがとうございます。内容を確認次第、ご返信いたします。
						</p>
					</div>
					<p>
						<a href="/contact">別のお問い合わせを送信する</a>
					</p>
				</article>
			) : (
				<article>
					<p>
						ご質問やご意見がございましたら、下記フォームよりお気軽にお問い合わせください。
					</p>

					<form method="post" action="/contact">
						<label>
							お名前
							<input type="text" name="name" required />
						</label>

						<label>
							返信先メールアドレス
							<input type="email" name="email" required />
						</label>

						<label>
							お問い合わせ内容
							<textarea name="message" rows={8} required />
						</label>

						<button type="submit">送信</button>
					</form>
				</article>
			)}
		</div>,
	);
});
