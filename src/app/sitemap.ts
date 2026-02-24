import { client } from "@/libs/client";
import type { Blog } from "@/types/microcms";

export default async function sitemap(): Promise<Array<{ url: string; lastModified: Date }>> {
  const baseUrl = 'https://my-study-log-gamma.vercel.app/'; // ★必ず自分の本番ドメインに変更すること

  // microCMSのlimitは最大100なので、ループして全件取得する
  let allContents: Blog[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const data = await client.getList<Blog>({
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

  const posts = allContents.map((post: Blog) => ({
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