import { defineConfig } from "drizzle-kit";

function getRequiredEnv(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}

export default defineConfig({
	schema: "./drizzle/schema.ts",
	out: "./drizzle/migrations",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: getRequiredEnv("CLOUDFLARE_ACCOUNT_ID"),
		databaseId: getRequiredEnv("CLOUDFLARE_DATABASE_ID"),
		token: getRequiredEnv("CLOUDFLARE_D1_TOKEN"),
	},
});
