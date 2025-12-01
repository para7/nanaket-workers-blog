import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import Footer from "../components/Footer";
import Header from "../components/Header";

// export default jsxRenderer(({ children, title }) => {
export default jsxRenderer(({ children }) => {
	return (
		<html lang="ja" data-theme="dark">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				{/* <title>{title || "nanaket-workers-blog"}</title> */}
				<title>nanaket-workers-blog</title>
				<link rel="icon" href="/favicon.ico" />
				<Link href="/app/style.css" rel="stylesheet" />
				<Script src="/app/client.ts" async />
			</head>
			<body>
				<Header />

				<main class="container">{children}</main>

				<Footer />
			</body>
		</html>
	);
});
