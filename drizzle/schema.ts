import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const viewcounts = sqliteTable("viewcounts", {
	slug: text("slug").primaryKey(),
	count: integer("count").notNull().default(0),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const comments = sqliteTable(
	"comments",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		postSlug: text("post_slug").notNull(),
		nickname: text("nickname").notNull(),
		content: text("content").notNull(),
		ipAddress: text("ip_address"),
		sessionId: text("session_id"),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => ({
		postSlugIdx: index("comments_post_slug_idx").on(table.postSlug),
	}),
);
