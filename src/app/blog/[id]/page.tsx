import { client } from "@/libs/client";
import type { Blog, Category, Tag } from "@/types/microcms";
import styles from "./page.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as cheerio from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import KatexScript from "@/components/KatexScript";
import FadeIn from "@/components/FadeIn";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cache } from "react";

// ISRの設定 (60秒キャッシュ)
export const revalidate = 60;

// 記事取得をメモ化する関数 (重複フェッチを防ぐ)
const getBlog = cache(async (id: string, draftKey?: string) => {
  return await client.get<Blog>({
    endpoint: "blogs",
    contentId: id,
    queries: { draftKey }
  }).catch(() => null);
});

// Next.js 15向けの型定義
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ draftKey?: string }>;
};

// 静的パス生成
export async function generateStaticParams() {
  const { contents } = await client.getList<Blog>({
    endpoint: "blogs",
    queries: { limit: 100 } // デフォルトの10件制限を回避
  });
  return contents.map((item) => ({
    id: item.id,
  }));
}

// 動的メタデータ生成(SEO用)
export async function generateMetadata({ params, searchParams }: Props) {
  const { id } = await params;
  const { draftKey } = await searchParams;
  
  const data = await getBlog(id, draftKey);

  if (!data) return { title: "記事が見つかりません" };

  const description = data.content
    ? data.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + "..."
    : "記事の詳細です";

  return {
    title: data.title,
    description: description,
    openGraph: {
      title: data.title,
      description: description,
      type: "article",
    },
  };
}

export default async function BlogId({ params, searchParams }: Props) {
  const { id } = await params;
  const { draftKey } = await searchParams;

  // 記事データの取得 (キャッシュを利用)
  const data = await getBlog(id, draftKey);

  if (!data) {
    notFound();
  }

  // 関連記事の取得
  let relatedPosts: Blog[] = [];
  if (data.category) {
    const relatedData = await client.getList<Blog>({
      endpoint: "blogs",
      queries: {
        filters: `category[equals]${data.category.id}[and]id[not_equals]${data.id}`,
        limit: 3,
        orders: "-publishedAt",
      }
    });
    relatedPosts = relatedData.contents;
  }

  // HTML加工処理
  const $ = cheerio.load(data.content);

  // コードハイライト
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });

  // 目次生成 & ID付与
  const toc: { id: string; text: string; tag: string }[] = [];
  $("h1, h2, h3").each((index, elm) => {
    const text = $(elm).text();
    const id = `section-${index}`;
    const tag = $(elm)[0].tagName;
    $(elm).attr("id", id);
    toc.push({ id, text, tag });
  });

  const processedContent = $.html();

  return (
    <article className={styles.articleWrapper}>
      {/* パンくずリスト表示エリア */}
      <div className={styles.breadcrumbsContainer}>
        <Breadcrumbs
          lists={[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            ...(data.category ? [{ name: data.category.name, path: `/category/${data.category.id}` }] : []),
            { name: data.title, path: `/blog/${data.id}` }
          ]}
        />
      </div>

      {/* ヒーローエリア */}
      <header className={styles.hero}>
        <FadeIn className={styles.heroContent}>
          <div className={styles.metaTop}>
            <time className={styles.date}>
              {new Date(data.publishedAt).toLocaleDateString()}
            </time>
            {data.category && (
              <Link href={`/category/${data.category.id}`}>
                <span className={styles.categoryBadge}>{data.category.name}</span>
              </Link>
            )}
          </div>
          <h1 className={styles.title}>{data.title}</h1>
          {data.tags && data.tags.length > 0 && (
            <div className={styles.tags}>
              {data.tags.map((tag) => (
                <Link href={`/tag/${tag.id}`} key={tag.id}>
                  <span className={styles.tag}>#{tag.name}</span>
                </Link>
              ))}
            </div>
          )}
        </FadeIn>
      </header>

      {/* コンテンツレイアウト */}
      <div className={styles.contentLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.tocSticky}>
            <h4 className={styles.tocTitle}>Table of Contents</h4>
            {toc.length === 0 ? (
              <p className={styles.noToc}>目次はありません</p>
            ) : (
              <nav>
                <ul className={styles.tocList}>
                  {toc.map((item) => (
                    <li key={item.id} className={`${styles.tocItem} ${styles[item.tag]}`}>
                      <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </aside>
        
        <div className={styles.mainContent}>
          <FadeIn>
            <div
              className={styles.postBody}
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </FadeIn>

          {/* 関連記事セクション */}
          {relatedPosts.length > 0 && (
            <section className={styles.relatedSection}>
              <h3 className={styles.relatedTitle}>Related Posts</h3>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((post) => (
                  <Link href={`/blog/${post.id}`} key={post.id} className={styles.relatedCard}>
                    <div className={styles.relatedContent}>
                      <span className={styles.relatedDate}>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <h4 className={styles.relatedPostTitle}>{post.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <KatexScript />
    </article>
  );
}