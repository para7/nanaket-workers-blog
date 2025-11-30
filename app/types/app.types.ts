import type { comments, posts } from "../../drizzle/schema";

// Posts型
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// Comments型
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
