import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

export default jsxRenderer(({ children, title }) => {
	return (
		<html lang="ja" data-theme="dark">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{title || "nanaket-workers-blog"}</title>
				<link rel="icon" href="/favicon.ico" />
				<Link href="/app/style.css" rel="stylesheet" />
				<Script src="/app/client.ts" async />
			</head>
			<body>
				<header>
					<nav>
						<ul>
							<li>
								<strong class="text-3xl">
									<a href="/">nanaket-workers-blog</a>
								</strong>
							</li>
						</ul>
					</nav>
				</header>

				<main class="container">{children}</main>

				<footer>
					<small>
						&copy; 2025 nanaket-workers-blog. Powered by HonoX and Cloudflare
						Workers.
					</small>
				</footer>
			</body>
		</html>
	);
});
