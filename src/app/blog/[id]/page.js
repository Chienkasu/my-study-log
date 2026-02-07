import { client } from "@/libs/client";
import styles from "./page.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as cheerio from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import KatexScript from "@/components/KatexScript";
import FadeIn from "@/components/FadeIn";

// ISRの設定（60秒キャッシュ）
export const revalidate = 60;

export async function generateStaticParams() {
  const { contents } = await client.get({ endpoint: "blogs" });
  return contents.map((item) => ({
    id: item.id,
  }));
}

export default async function BlogId({ params }) {
  const { id } = await params;
  
  // 記事データの取得（エラーハンドリング付き）
  const data = await client.get({ 
    endpoint: "blogs", 
    contentId: id 
  }).catch(() => null);

  if (!data) {
    notFound();
  }

  // --- HTML加工処理 (サーバーサイド) ---
  const $ = cheerio.load(data.content);

  // 1. コードハイライト
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });

  // 2. 目次生成 & ID付与
  const toc = [];
  $("h1, h2, h3").each((index, elm) => {
    const text = $(elm).text();
    const id = `section-${index}`;
    const tag = $(elm)[0].tagName; // "h1", "h2", "h3"

    // 本文のタグにIDを埋め込む（ジャンプ用）
    $(elm).attr("id", id);

    toc.push({ id, text, tag });
  });

  const processedContent = $.html();

  return (
    <article className={styles.articleWrapper}>
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

      {/* コンテンツレイアウト（目次 + 本文） */}
      <div className={styles.contentLayout}>
        {/* ▼▼▼ サイドバー（目次） ▼▼▼ */}
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

        {/* 本文エリア */}
        <div className={styles.mainContent}>
          <FadeIn>
            <div
              className={styles.postBody}
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </FadeIn>
        </div>
      </div>

      <KatexScript />
    </article>
  );
}