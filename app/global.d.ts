import type {} from "hono";
import type { D1Database, Fetcher } from "@cloudflare/workers-types";
import type { IUsecases } from "./usecases";

declare module "hono" {
	interface Env {
		Variables: {
			usecases: IUsecases;
		};
		Bindings: {
			nanaket_blog: D1Database;
			ASSETS: Fetcher;
		};
	}
}
