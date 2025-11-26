import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './drizzle/schema.ts',
	out: './drizzle/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/66ba0f52-7d97-4218-9477-aa1954b6c2e8.sqlite',
	},
});
