// 修正案
import { client } from "@/libs/client";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { contents } = await client.get({ endpoint: "blogs" }); 
  return contents.map((item) => ({
    id: item.id,
  }));
}

export default async function BlogId({ params }) {
  const { id } = await params;
  
  // 記事が見つからない場合のハンドリングを追加
  const data = await client.get({ 
    endpoint: "blogs", 
    contentId: id 
  }).catch(() => null);

  if (!data) {
    notFound();
  }

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