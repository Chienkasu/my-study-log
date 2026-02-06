import { client } from "@/libs/client";
import styles from "./page.module.css";
import Link from "next/link";
import * as cheerio from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css"; // CSSはここで読み込んでおく

// ★作成したコンポーネントをインポート
import KatexScript from "@/components/KatexScript";

// 静的パスの生成
export async function generateStaticParams() {
  const { contents } = await client.get({ endpoint: "blogs" });
  return contents.map((item) => ({
    id: item.id,
  }));
}

export default async function BlogId({ params }) {
  const { id } = await params;
  const data = await client.get({ endpoint: "blogs", contentId: id });

  // --- HTML加工処理 ---
  const $ = cheerio.load(data.content);

  // 1. コードハイライト
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });

  // 2. 目次生成
  const toc = [];
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
      {/* ヒーローエリア */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
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
        </div>
      </header>

      {/* レイアウト */}
      <div className={styles.contentLayout}>
        {/* サイドバー（目次） */}
        <aside className={styles.sidebar}>
          <div className={styles.tocSticky}>
            <h4 className={styles.tocTitle}>目次</h4>
            <nav>
              <ul className={styles.tocList}>
                {toc.map((item) => (
                  <li key={item.id} className={`${styles.tocItem} ${styles[item.tag]}`}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* 本文 */}
        <div className={styles.mainContent}>
          <div
            className={styles.postBody}
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </div>
      </div>

      {/* ★ここに配置（これでクライアント側で数式変換が走ります） */}
      <KatexScript />
    </article>
  );
}