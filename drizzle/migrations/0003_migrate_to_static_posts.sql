-- Drop posts table
DROP TABLE IF EXISTS `posts`;

-- Create viewcounts table
CREATE TABLE `viewcounts` (
	`slug` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Recreate comments table with postSlug
CREATE TABLE `comments_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_slug` text NOT NULL,
	`nickname` text NOT NULL,
	`content` text NOT NULL,
	`ip_address` text,
	`session_id` text,
	`created_at` integer NOT NULL
);

-- Create index on post_slug
CREATE INDEX `comments_post_slug_idx` ON `comments_new` (`post_slug`);

-- Drop old comments table
DROP TABLE `comments`;

-- Rename new table
ALTER TABLE `comments_new` RENAME TO `comments`;
