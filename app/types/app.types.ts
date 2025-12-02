import type { comments } from "../../drizzle/schema";

// Comments型
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
