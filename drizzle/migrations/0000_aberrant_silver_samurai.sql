CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`nickname` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `comments_post_id_idx` ON `comments` (`post_id`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
-- サンプルデータの挿入
INSERT INTO posts (title, slug, content, published_at, created_at, updated_at) VALUES
('HonoXでブログを作成しました', 'honox-blog-creation', '# HonoXとは

HonoXは、Honoフレームワークをベースにしたフルスタックフレームワークです。

## 主な特徴

- **ファイルベースルーティング**: Next.jsライクなルーティング
- **Islandsアーキテクチャ**: 必要な部分だけクライアントサイドJavaScript
- **エッジ対応**: Cloudflare Workersで高速動作

## まとめ

HonoXを使えば、簡単にブログアプリケーションを構築できます。', strftime('%s', 'now'), strftime('%s', 'now'), strftime('%s', 'now')),
('Cloudflare D1の使い方', 'cloudflare-d1-usage', '# D1データベースとは

Cloudflare D1は、Cloudflare Workersで使用できるサーバーレスSQLデータベースです。

## セットアップ

1. D1データベースを作成
2. wrangler.jsonc に設定を追加
3. Drizzle ORMでスキーマを定義

## メリット

- **エッジロケーションで動作**: 低レイテンシー
- **無料枠が充実**: 小規模アプリに最適
- **SQLiteベース**: 使い慣れたSQL文法

## 実装例

```typescript
export function getDb(c: Context) {
  return drizzle(c.env.nanaket_blog, { schema });
}
```

このようにシンプルにデータベース接続を行えます。', strftime('%s', 'now'), strftime('%s', 'now'), strftime('%s', 'now')),
('Markdownで記事を書こう', 'writing-with-markdown', '# Markdownの基本

Markdownは、シンプルで読みやすいマークアップ言語です。

## 基本的な書き方

### 見出し

`#` の数で見出しレベルを指定します。

### リスト

- 箇条書きは `*` または `-` で始めます
- ネストも可能です
  - このように

### コードブロック

```javascript
const greeting = "Hello, World!";
console.log(greeting);
```

### 強調

**太字**は `**テキスト**` で囲みます。
*イタリック*は `*テキスト*` で囲みます。

## まとめ

Markdownを使えば、記事を効率的に書くことができます。', strftime('%s', 'now'), strftime('%s', 'now'), strftime('%s', 'now'));