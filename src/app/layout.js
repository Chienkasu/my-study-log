import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "大学生の備忘録",
  description: "大学で学んだことや技術的な知見をアーカイブする学習ログ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={notoSansJp.className}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
