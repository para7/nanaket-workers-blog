import type {} from "hono";
import type { D1Database } from "@cloudflare/workers-types";

declare module "hono" {
	interface Env {
		Variables: Record<string, never>;
		Bindings: {
			nanaket_blog: D1Database;
		};
	}
}
