type PostCardProps = {
	id: number;
	title: string;
	slug: string;
	publishedAt: string | Date | null;
};

export default function PostCard({ title, slug, publishedAt }: PostCardProps) {
	return (
		<article>
			<hgroup>
				<h2 class="text-4xl">
					<a href={`/posts/${slug}`}>{title}</a>
				</h2>
				{publishedAt && (
					<p>
						<time>
							{new Date(publishedAt).toLocaleDateString("ja-JP", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</time>
					</p>
				)}
			</hgroup>
		</article>
	);
}
