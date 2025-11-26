import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'nanaket-workers-blog'}</title>
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body class="min-h-screen flex flex-col bg-white text-gray-900">
        <header class="bg-blue-600 text-white shadow-md">
          <div class="max-w-4xl mx-auto px-4 py-6">
            <a href="/" class="text-2xl font-bold text-white no-underline hover:text-blue-100 transition-colors">
              nanaket-workers-blog
            </a>
          </div>
        </header>

        <main class="flex-1">
          {children}
        </main>

        <footer class="bg-gray-100 border-t border-gray-300 mt-auto">
          <div class="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
            <p>&copy; 2025 nanaket-workers-blog. Powered by HonoX and Cloudflare Workers.</p>
          </div>
        </footer>
      </body>
    </html>
  )
})
