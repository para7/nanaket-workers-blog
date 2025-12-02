---
title: "HonoX入門"
slug: "introduction-to-honox"
publishedAt: "2025-12-02T14:00:00+09:00"
description: "HonoXの基本的な使い方を学びましょう"
tags: ["HonoX", "Tutorial", "TypeScript"]
category: "チュートリアル"
author: "nanaket"
---

# HonoX入門

HonoXは、Honoをベースにしたファイルベースルーティングを持つSSRフレームワークです。

## HonoXの特徴

### 1. ファイルベースルーティング

`app/routes/`ディレクトリにファイルを配置するだけでルーティングが自動生成されます。

```
app/routes/
  ├── index.tsx       → /
  ├── about.tsx       → /about
  └── posts/
      └── [slug].tsx  → /posts/:slug
```

### 2. SSR対応

サーバーサイドレンダリングが標準で有効になっており、SEOに優れたアプリケーションを構築できます。

### 3. Edge環境での実行

Cloudflare Workers、Deno、Bun など、様々なエッジランタイムで動作します。

## 基本的な使い方

### ルートの作成

```typescript
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <div>
      <h1>Hello HonoX!</h1>
    </div>
  );
});
```

### 動的ルート

```typescript
export default createRoute((c) => {
  const slug = c.req.param("slug");
  return c.render(
    <div>
      <h1>Post: {slug}</h1>
    </div>
  );
});
```

## まとめ

HonoXを使うことで、エッジ環境で高速に動作するSSRアプリケーションを簡単に構築できます。
