import { client } from "@/libs/client";

export default async function sitemap() {
  const baseUrl = 'https://your-domain.com'; // ★必ず自分の本番ドメインに変更すること

  // microCMSのlimitは最大100なので、ループして全件取得する
  let allContents = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const data = await client.get({
      endpoint: 'blogs',
      queries: {
        limit: limit,
        offset: offset,
        fields: 'id,updatedAt', // 必要なデータだけ取得して軽量化
      },
    });

    allContents = [...allContents, ...data.contents];

    // 今回取得した数がlimitより少なければ、もう次のページはないので終了
    if (data.contents.length < limit) {
      break;
    }

    // 次のページの開始位置を設定
    offset += limit;
  }

  const posts = allContents.map((post) => ({
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