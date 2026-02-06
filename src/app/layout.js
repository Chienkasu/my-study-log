import { Noto_Sans_JP } from "next/font/google";
import "./globals.css"; // コメントアウトを外す！
import Header from "@/components/Header"; // 追加
import Footer from "@/components/Footer"; // 追加

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "IUMe - Learning Platform",
  description: "Personalized learning matching service.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={notoSansJp.className}>
      <body>
        <Header />
        {/* Headerがfixedなので、トップページの最初の要素には
            padding-topをつけたり、全画面FV(First View)を配置したりする必要がある */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}