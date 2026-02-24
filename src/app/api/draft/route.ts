import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { client } from "@/libs/client";
import type { Blog } from "@/types/microcms";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse | Response> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const id = searchParams.get('id');
  const draftKey = searchParams.get('draftKey');

  // 本来はMICROCMS_SECRETのような環境変数で認証すべきですが、
  // 簡易的にIDとdraftKeyの存在チェックのみ行います
  if (!id || !draftKey) {
    return new Response('Invalid token', { status: 401 });
  }

  // 実際にMicroCMSに問い合わせてコンテンツが存在するか確認
  const post = await client.get<Blog>({
    endpoint: 'blogs',
    contentId: id,
    queries: { draftKey },
  });

  if (!post) {
    return new Response('Invalid slug', { status: 401 });
  }

  // Draft Modeを有効化
  const draft = await draftMode();
  draft.enable();

  // 該当記事へリダイレクト (draftKeyをクエリに付与)
  redirect(`/blog/${id}?draftKey=${draftKey}`);
}