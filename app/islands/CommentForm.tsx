import { useState } from 'hono/jsx'

export default function CommentForm({ postId }: { postId: number }) {
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    try {
      // クライアントサイドバリデーション
      const validationErrors: string[] = []

      if (!nickname || nickname.length < 1 || nickname.length > 50) {
        validationErrors.push('ニックネームは1-50文字で入力してください')
      }

      if (!content || content.length < 1 || content.length > 1000) {
        validationErrors.push('コメント内容は1-1000文字で入力してください')
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setIsSubmitting(false)
        return
      }

      // APIにPOST
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          nickname,
          content,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // 成功したらページをリロード
        window.location.reload()
      } else {
        setErrors(result.errors || ['コメントの投稿に失敗しました'])
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Comment submission error:', error)
      setErrors(['コメントの投稿に失敗しました'])
      setIsSubmitting(false)
    }
  }

  return (
    <div class="bg-gray-50 rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-4">コメントを投稿</h3>

      {errors.length > 0 && (
        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <ul class="list-disc list-inside text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div class="mb-4">
          <label htmlFor="nickname" class="block text-sm font-medium text-gray-700 mb-2">
            ニックネーム <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onInput={(e) => setNickname((e.target as HTMLInputElement).value)}
            maxLength={50}
            required
            disabled={isSubmitting}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent disabled:bg-gray-100 transition-all"
            placeholder="名前を入力してください"
          />
          <p class="mt-1 text-sm text-gray-500">{nickname.length}/50文字</p>
        </div>

        <div class="mb-4">
          <label htmlFor="content" class="block text-sm font-medium text-gray-700 mb-2">
            コメント <span class="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
            maxLength={1000}
            required
            disabled={isSubmitting}
            rows={4}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent disabled:bg-gray-100 transition-all"
            placeholder="コメントを入力してください"
          />
          <p class="mt-1 text-sm text-gray-500">{content.length}/1000文字</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg border-none cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '投稿中...' : 'コメントを投稿'}
        </button>
      </form>
    </div>
  )
}
