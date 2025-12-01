// type Comment = {
// 	id: number;
// 	nickname: string;
// 	content: string;
// 	createdAt: string | Date;
// };

// type CommentListProps = {
// 	comments: Comment[];
// };

// export default function CommentList({ comments }: CommentListProps) {
// 	if (comments.length === 0) {
// 		return null;
// 	}

// 	return (
// 		<div>
// 			{comments.map((comment) => (
// 				<article key={comment.id}>
// 					<header>
// 						<strong>{comment.nickname}</strong>{" "}
// 						<small>
// 							<time>{new Date(comment.createdAt).toLocaleString("ja-JP")}</time>
// 						</small>
// 					</header>
// 					<p style="white-space: pre-wrap">{comment.content}</p>
// 				</article>
// 			))}
// 		</div>
// 	);
// }
