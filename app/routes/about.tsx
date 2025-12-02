import { createRoute } from "honox/factory";

export default createRoute(async (c) => {
	return c.render(
		<div>
			<title>About - nanaket-workers-blog</title>
			<h1>About</h1>

			<article>
				<h2>このブログについて</h2>
				<p>
					nanaket-workers-blogは、Cloudflare
					WorkersとHonoXを使用して構築されたモダンなブログアプリケーションです。
				</p>
				<p>
					技術スタックとして、HonoX（SSRフレームワーク）、Cloudflare
					D1（SQLiteデータベース）、 Drizzle ORM、Pico CSS、Tailwind CSS
					v4を採用しています。
				</p>
			</article>

			<article>
				<h2>管理者について</h2>
				<p>
					Web開発とエッジコンピューティングに情熱を注ぐエンジニアです。
					最新の技術を活用して、高速で信頼性の高いWebアプリケーションの構築を目指しています。
				</p>
			</article>
		</div>,
	);
});
