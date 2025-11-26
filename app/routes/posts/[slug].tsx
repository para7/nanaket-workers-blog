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
    <div class="min-h-screen">
      <title>{post.title} - nanaket-workers-blog</title>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <nav class="mb-8">
          <a href="/" class="text-blue-600 no-underline hover:text-blue-800 transition-colors">← 記事一覧に戻る</a>
        </nav>

        <article class="mb-12">
          <header class="mb-8">
            <h1 class="text-4xl font-bold mb-4">{post.title}</h1>
            {post.publishedAt && (
              <time class="text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </header>

          <div
            class="prose text-lg leading-7 max-w-none
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-4
              [&_p]:my-2
              [&_a]:text-blue-600 [&_a]:underline
              [&_ul]:my-2 [&_ul]:pl-8
              [&_ol]:my-2 [&_ol]:pl-8
              [&_li]:my-1
              [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
              [&_pre]:bg-gray-800 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
              [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>

        <section class="border-t border-gray-300 pt-8">
          <h2 class="text-2xl font-bold mb-6">コメント ({postComments.length})</h2>

          {postComments.length > 0 && (
            <div class="flex flex-col gap-6 mb-8">
              {postComments.map((comment) => (
                <div key={comment.id} class="border border-gray-300 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold">{comment.nickname}</span>
                    <time class="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString('ja-JP')}
                    </time>
                  </div>
                  <p class="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          <CommentForm postId={post.id} />
        </section>
      </div>
    </div>
  )
})
