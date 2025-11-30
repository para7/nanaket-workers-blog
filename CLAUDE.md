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

### Code Quality
```bash
# Type checking
pnpm run typecheck

# Linting
pnpm run lint        # Check for linting issues
pnpm run lint:fix    # Fix linting issues

# Formatting
pnpm run format      # Format code with Biome

# Combined check (lint + format)
pnpm run check       # Check both linting and formatting
pnpm run check:fix   # Fix both linting and formatting issues
```

**Tool**: Uses Biome for linting and formatting (configured in `biome.json`).

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
  ├── server.ts          # Server entry with DI middleware setup
  ├── global.d.ts        # Hono environment type definitions
  ├── style.css          # Global styles
  ├── lib/
  │   └── db.ts          # Database helper (getDb function)
  ├── repositories/      # Data access layer (Repository pattern)
  │   ├── index.ts       # Repositories factory & interfaces
  │   ├── posts.repository.ts
  │   └── comments.repository.ts
  ├── usecases/          # Business logic layer (Application services)
  │   ├── index.ts       # Usecases factory & interfaces
  │   ├── posts.usecase.ts
  │   └── comments.usecase.ts
  ├── validators/        # Input validation
  │   └── comment.validator.ts
  ├── types/             # Shared types and custom errors
  │   └── errors.ts      # ValidationError, NotFoundError
  ├── routes/            # Presentation layer (file-based routing)
  │   ├── index.tsx      # Homepage
  │   ├── _renderer.tsx  # Layout renderer
  │   ├── _404.tsx       # 404 page
  │   ├── _error.tsx     # Error page
  │   ├── api/
  │   │   └── comments.ts  # POST /api/comments endpoint
  │   └── posts/
  │       └── [slug].tsx   # Dynamic route for /posts/:slug
  ├── components/        # Shared components
  │   └── CommentForm.tsx
  └── islands/           # Interactive client components
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

### Layered Architecture & Repository Pattern

This project implements a **3-layer architecture** with **Repository pattern** using a functional approach:

```
Routes (Presentation) → Usecases (Application) → Repositories (Data Access)
                                                          ↓
                                                    Database (D1)
```

#### Layer Responsibilities

**1. Routes (`app/routes/`)**: Presentation layer
- Handle HTTP requests/responses
- UI rendering with JSX
- Access business logic via `c.var.usecases` (injected by middleware)
- Should NOT directly access repositories or database

**2. Usecases (`app/usecases/`)**: Application/Business logic layer
- Orchestrate business operations
- Data transformation (e.g., Markdown → HTML)
- Input validation (calls validators)
- Coordinate multiple repositories
- Return view models optimized for presentation

**3. Repositories (`app/repositories/`)**: Data access layer
- Database queries using Drizzle ORM
- CRUD operations
- Query optimization
- Return domain entities (inferred from schema)

**4. Validators (`app/validators/`)**: Input validation
- Validate and sanitize user input
- Throw `ValidationError` with error messages
- Type transformation (e.g., string → number)

#### Dependency Injection

Dependencies are injected via middleware in `app/server.ts`:

```typescript
// app/server.ts
export const setup = createMiddleware(async (c, next) => {
  const db = getDb(c);                    // 1. Get DB connection
  const repos = repositories(db);         // 2. Create repositories
  const cases = usecases(repos);          // 3. Create usecases
  c.set("usecases", cases);               // 4. Inject into context
  await next();
});
```

Type-safe context variables are defined in `app/global.d.ts`:

```typescript
declare module "hono" {
  interface Env {
    Variables: {
      usecases: IUsecases;
    };
  }
}
```

#### Functional Approach

All layers use **factory functions** (not classes) that return objects implementing interfaces:

```typescript
// Repository factory
export const postsRepository = (db: DrizzleD1Database): IPostsRepository => ({
  findPublishedPosts: async () => { /* ... */ },
  findBySlug: async (slug: string) => { /* ... */ },
});

// Usecase factory
export const postsUsecase = (repositories: IRepositories): IPostsUsecase => ({
  getPublishedPosts: async () => { /* ... */ },
  getPostDetailBySlug: async (slug: string) => { /* ... */ },
});
```

#### Implementation Example

**Route** (`app/routes/posts/[slug].tsx`):
```typescript
export default createRoute(async (c) => {
  const slug = c.req.param("slug");

  // Call usecase (NOT repository directly)
  const viewModel = await c.var.usecases.posts.getPostDetailBySlug(slug);

  return c.render(<PostPage {...viewModel} />);
});
```

**Usecase** (`app/usecases/posts.usecase.ts`):
```typescript
getPostDetailBySlug: async (slug: string) => {
  const post = await repositories.posts.findBySlug(slug);
  if (!post) throw new NotFoundError("記事が見つかりません");

  // Business logic: Markdown rendering
  const htmlContent = await marked(post.content);

  // Fetch related data
  const comments = await repositories.comments.findByPostId(post.id);

  // Return view model
  return { post: { ...post, htmlContent }, comments };
},
```

**Repository** (`app/repositories/posts.repository.ts`):
```typescript
findBySlug: async (slug: string) => {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  return result[0] || null;
},
```

#### Error Handling

Two custom error types in `app/types/errors.ts`:
- **ValidationError**: Thrown by validators, contains array of error messages
- **NotFoundError**: Thrown when entity not found, triggers 404 response

#### Adding New Features

When adding new features, follow this pattern:

1. **Define types** in repository file (use `$inferSelect` from schema)
2. **Add repository methods** for data access
3. **Add usecase methods** for business logic
4. **Use in routes** via `c.var.usecases`
5. **Update interfaces** and index files for type safety

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
Blog post content is stored as Markdown in the database and rendered to HTML at the **usecase layer** using the `marked` library (`app/usecases/posts.usecase.ts`). The HTML is included in the view model returned to routes, keeping presentation logic separate from business logic.

## Development Notes

- **Package Manager**: Uses `pnpm` (see `pnpm-lock.yaml`)
- **Local Database**: Stored in `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/66ba0f52-7d97-4218-9477-aa1954b6c2e8.sqlite`
- **Language**: UI text is in Japanese
- **Styling**: Dark theme by default (`data-theme="dark"` in `_renderer.tsx`)
- **Client Bundling**: Entry points are `/app/client.ts` and `/app/style.css` (defined in `vite.config.ts`)
- **Architecture**:
  - Always use usecases from routes (`c.var.usecases`), never access repositories directly
  - Follow functional programming approach with factory functions
  - Keep each layer focused on its responsibility
  - Use interfaces for type safety and easier testing
