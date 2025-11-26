import type {} from 'hono'
import type { D1Database } from '@cloudflare/workers-types'

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {
      nanaket_blog: D1Database
    }
  }
}
