import { createRoute } from 'honox/factory'
import { getDb } from '../../lib/db'
import { posts, comments } from '../../../drizzle/schema'
import { eq, asc } from 'drizzle-orm'
import { marked } from 'marked'
import CommentForm from '../../islands/CommentForm'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')
  const db = getDb(c)

  // 記事を取得
  const postResult = await db.select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1)

  if (postResult.length === 0) {
    return c.notFound()
  }

  const post = postResult[0]

  // Markdownを HTMLに変換
  const htmlContent = await marked(post.content)

  // コメントを取得
  const postComments = await db.select()
    .from(comments)
    .where(eq(comments.postId, post.id))
    .orderBy(asc(comments.createdAt))

  return c.render(
    <div>
      <title>{post.title} - nanaket-workers-blog</title>
      <nav>
        <ul>
          <li><a href="/">← 記事一覧に戻る</a></li>
        </ul>
      </nav>

      <article>
        <header>
          <h1>{post.title}</h1>
          {post.publishedAt && (
            <p>
              <time>
                {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </p>
          )}
        </header>

        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>

      <section>
        <h2>コメント ({postComments.length})</h2>

        {postComments.length > 0 && (
          <div>
            {postComments.map((comment) => (
              <article key={comment.id}>
                <header>
                  <strong>{comment.nickname}</strong>
                  {' '}
                  <small>
                    <time>
                      {new Date(comment.createdAt).toLocaleString('ja-JP')}
                    </time>
                  </small>
                </header>
                <p style="white-space: pre-wrap">{comment.content}</p>
              </article>
            ))}
          </div>
        )}

        <CommentForm postId={post.id} />
      </section>
    </div>
  )
})
