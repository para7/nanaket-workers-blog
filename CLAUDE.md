# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a blog application built with HonoX (Hono + SSR framework) deployed on Cloudflare Workers, using Cloudflare D1 (SQLite) for database storage. The application supports blog posts with Markdown rendering and a commenting system.

## Development Commands

### Development Server
```bash
pnpm run dev
```
Starts Vite dev server with HonoX and Cloudflare Workers adapter.

### Building
```bash
pnpm run build
```
Builds both client and server bundles. Client build runs first (`--mode client`), followed by server build.

### Preview & Deploy
```bash
pnpm run preview    # Preview with wrangler dev (local)
pnpm run deploy     # Build and deploy to Cloudflare Workers
```

### Database Operations
```bash
# Generate migrations from schema changes
pnpm run db:generate

# Apply migrations locally (uses .wrangler/state/v3/d1/...)
pnpm run db:migrate:local

# Apply migrations to production
pnpm run db:migrate:prod

# Open Drizzle Studio for local DB (port 3333)
pnpm run db:studio:local

# Open Drizzle Studio for production DB (port 3333)
pnpm run db:studio:prod
```

**Important**: Always run `db:generate` after modifying `drizzle/schema.ts`, then apply migrations with `db:migrate:local` for local development or `db:migrate:prod` for production.

## Architecture

### Framework Stack
- **HonoX**: File-based routing SSR framework on top of Hono
- **Cloudflare Workers**: Edge runtime environment
- **Vite**: Build tool with `@hono/vite-build` and `@hono/vite-dev-server`
- **Drizzle ORM**: Type-safe ORM for D1 database access
- **Pico CSS + Tailwind CSS v4**: Styling (Pico for base, Tailwind for utilities)

### Project Structure
```
app/
  ├── client.ts          # Client-side entry (hydration)
  ├── server.ts          # Server entry (HonoX app creation)
  ├── global.d.ts        # Hono environment type definitions
  ├── style.css          # Global styles
  ├── lib/
  │   └── db.ts          # Database helper (getDb function)
  ├── routes/            # File-based routes
  │   ├── index.tsx      # Homepage
  │   ├── _renderer.tsx  # Layout renderer
  │   ├── _404.tsx       # 404 page
  │   ├── _error.tsx     # Error page
  │   ├── api/
  │   │   └── comments.ts  # POST /api/comments endpoint
  │   └── posts/
  │       └── [slug].tsx   # Dynamic route for /posts/:slug
  └── islands/           # Interactive client components
      ├── CommentForm.tsx
      └── counter.tsx

drizzle/
  ├── schema.ts          # Database schema (posts, comments tables)
  └── migrations/        # SQL migration files

public/                  # Static assets

dist/                    # Build output (client + server bundles)
```

### Routing
HonoX uses file-based routing:
- `app/routes/index.tsx` → `/`
- `app/routes/posts/[slug].tsx` → `/posts/:slug`
- `app/routes/api/comments.ts` → `/api/comments`

Routes export default functions created with `createRoute()` from `honox/factory`.

### Database Access Pattern
1. Import `getDb` from `app/lib/db.ts`
2. Call `getDb(c)` with Hono context to get typed Drizzle instance
3. Use Drizzle query methods with schema imported from `drizzle/schema.ts`

Example:
```typescript
import { getDb } from '../../lib/db'
import { posts } from '../../../drizzle/schema'
import { eq } from 'drizzle-orm'

const db = getDb(c)
const result = await db.select().from(posts).where(eq(posts.slug, slug))
```

### Environment & Bindings
- D1 database binding: `nanaket_blog` (defined in `wrangler.jsonc`)
- Typed in `app/global.d.ts` via Hono module augmentation
- Access via `c.env.nanaket_blog` in route handlers

### Client-Side Interactivity
Components in `app/islands/` are hydrated on the client. These use Hono's JSX with hooks (`useState`, etc.) and are registered via `createClient()` in `app/client.ts`.

### Configuration Files
- **wrangler.jsonc**: Cloudflare Workers configuration with D1 binding, compatibility flags (`nodejs_compat`), and observability settings
- **drizzle.config.ts**: Production Drizzle config (uses D1 HTTP API with credentials from env vars)
- **drizzle.config.local.ts**: Local Drizzle config (points to local SQLite file in `.wrangler/state/`)
- **vite.config.ts**: Vite configuration with HonoX, Tailwind, and Cloudflare Workers build plugins

### Database Schema
Two main tables in `drizzle/schema.ts`:
- **posts**: id, title, slug (unique), content (Markdown), publishedAt, createdAt, updatedAt
- **comments**: id, postId (FK to posts with cascade delete), nickname, content, createdAt
  - Index on postId for performance

### Markdown Rendering
Blog post content is stored as Markdown and rendered to HTML using the `marked` library in `app/routes/posts/[slug].tsx` via `marked(post.content)`.

## Development Notes

- **Package Manager**: Uses `pnpm` (see `pnpm-lock.yaml`)
- **Local Database**: Stored in `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/66ba0f52-7d97-4218-9477-aa1954b6c2e8.sqlite`
- **Language**: UI text is in Japanese
- **Styling**: Dark theme by default (`data-theme="dark"` in `_renderer.tsx`)
- **Client Bundling**: Entry points are `/app/client.ts` and `/app/style.css` (defined in `vite.config.ts`)
