import { createRoute } from 'honox/factory'
import { getDb } from '../lib/db'
import { posts } from '../../drizzle/schema'
import { desc, isNotNull } from 'drizzle-orm'

export default createRoute(async (c) => {
  const db = getDb(c)
  const postsList = await db.select({
    id: posts.id,
    title: posts.title,
    slug: posts.slug,
    publishedAt: posts.publishedAt,
  }).from(posts)
    .where(isNotNull(posts.publishedAt))
    .orderBy(desc(posts.publishedAt))

  return c.render(
    <div>
      <title>nanaket-workers-blog</title>
      <h1>記事一覧</h1>
      {postsList.map((post) => (
        <article key={post.id}>
          <hgroup>
            <h2><a href={`/posts/${post.slug}`}>{post.title}</a></h2>
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
          </hgroup>
        </article>
      ))}
    </div>
  )
})
