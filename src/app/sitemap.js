import { client } from "@/libs/client";

export default async function sitemap() {
  const baseUrl = 'https://your-domain.com'; // 自分のURLに変更

  // 全記事を取得
  const { contents } = await client.get({
    endpoint: 'blogs',
    queries: { limit: 1000 }, // 記事数が多い場合はページネーションが必要
  });

  const posts = contents.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.updatedAt),
  }));

  const routes = [
    '',
    '/blog',
    '/about',
    '/categories',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...routes, ...posts];
}