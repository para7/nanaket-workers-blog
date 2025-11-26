import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	content: text('content').notNull(),
	publishedAt: integer('published_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
