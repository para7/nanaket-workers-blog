import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../drizzle/schema';
import type { Context } from 'hono';

export function getDb(c: Context) {
	return drizzle(c.env.nanaket_blog, { schema });
}
