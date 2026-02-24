import { createClient, MicroCMSQueries } from "microcms-js-sdk";
import type { Blog, Category, Tag } from "@/types/microcms";

// 環境変数が定義されていることを確認
if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is not defined");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is not defined");
}

// 型定義
interface Endpoints {
  blogs: Blog;
  categories: Category;
  tags: Tag;
}

export const client = createClient<Endpoints>({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});