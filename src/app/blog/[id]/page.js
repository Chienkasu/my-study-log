import { client } from "@/libs/client";

// 静的パスを生成
export async function generateStaticParams() {
  // 変更点: "blogs" -> "blog"
  const { contents } = await client.get({ endpoint: "blogs" });
  const paths = contents.map((item) => ({
    id: item.id,
  }));
  return paths;
}

export default async function BlogId({ params }) {
  // ★ ここ修正！ Next.js 15なら await が必要
  const { id } = await params; 
  
  const data = await client.get({ endpoint: "blogs", contentId: id });

  return (
    <main>
      <h1>{data.title}</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: `${data.content}`,
        }}
      />
    </main>
  );
}
