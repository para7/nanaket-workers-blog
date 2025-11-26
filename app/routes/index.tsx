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
    <div class="min-h-screen">
      <title>nanaket-workers-blog</title>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-8">記事一覧</h1>
        <div class="flex flex-col gap-6">
          {postsList.map((post) => (
            <article key={post.id} class="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <a href={`/posts/${post.slug}`} class="block no-underline">
                <h2 class="text-2xl font-semibold mb-2 text-blue-600 hover:text-blue-800 transition-colors">
                  {post.title}
                </h2>
                {post.publishedAt && (
                  <time class="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
})
