type HeaderProps = {
	currentPath: string;
};

export default function Header({ currentPath }: HeaderProps) {
	const isActive = (path: string) => currentPath === path;

	return (
		<header class="container">
			<nav>
				<ul>
					<li>
						<strong class="text-3xl">
							<a href="/">nanaket-workers-blog</a>
						</strong>
					</li>
				</ul>
			</nav>
			<nav>
				<ul style="flex-wrap: wrap;">
					<li>
						<a
							href="/"
							class={isActive("/") ? "contrast" : ""}
							aria-current={isActive("/") ? "page" : undefined}
						>
							ホーム
						</a>
					</li>
					<li>
						<a
							href="/about"
							class={isActive("/about") ? "contrast" : ""}
							aria-current={isActive("/about") ? "page" : undefined}
						>
							About
						</a>
					</li>
					<li>
						<a
							href="/contact"
							class={isActive("/contact") ? "contrast" : ""}
							aria-current={isActive("/contact") ? "page" : undefined}
						>
							Contact
						</a>
					</li>
				</ul>
			</nav>
		</header>
	);
}
