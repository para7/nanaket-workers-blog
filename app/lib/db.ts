import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import * as schema from "../../drizzle/schema";

export function getDb(c: Context) {
	return drizzle(c.env.nanaket_blog, { schema });
}
