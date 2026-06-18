import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const revalidate = 3600; // 1時間キャッシュ

interface GameResult {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  venue: string;
  result: "win" | "loss" | "draw" | "cancelled" | "scheduled";
  winPitcher: string;
  losePitcher: string;
}

export async function GET() {
  try {
    const now = new Date();
    // 日本時間で月を取得 (UTC+9)
    const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const currentMonth = String(jstDate.getUTCMonth() + 1).padStart(2, "0");
    const year = jstDate.getUTCFullYear();

    // 今月と先月の2ヶ月分を取得
    const prevMonth = String(
      jstDate.getUTCMonth() === 0 ? 12 : jstDate.getUTCMonth()
    ).padStart(2, "0");

    const months = [prevMonth, currentMonth];
    const allGames: GameResult[] = [];

    for (const month of months) {
      const url = `https://npb.jp/games/${year}/schedule_${month}_detail.html`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "MyStudyLog/1.0 (personal study blog)",
        },
      });

      if (!res.ok) continue;

      const html = await res.text();
      const $ = cheerio.load(html);

      // テーブルの各行をパース
      let currentDate = "";

      $("#schedule_detail table tbody tr").each((_, row) => {
        const $row = $(row);

        // 日付セルがあれば更新
        const dateCell = $row.find("th");
        if (dateCell.length > 0) {
          const dateText = dateCell.text().trim();
          if (dateText) {
            currentDate = dateText;
          }
        }

        // 対戦カードをパース
        const matchCell = $row.find("td").first();
        const team1Text = matchCell.find(".team1").text().trim();
        const team2Text = matchCell.find(".team2").text().trim();

        if (!team1Text || !team2Text) return;

        // 中日の試合のみフィルタ
        if (team1Text !== "中日" && team2Text !== "中日") return;

        const score1Text = matchCell.find(".score1").text().trim();
        const score2Text = matchCell.find(".score2").text().trim();
        const isCancelled = matchCell.find(".cancel").length > 0;

        const venue = $row.find("td").eq(1).find(".place").text().trim();

        // 責任投手
        const pitcherCell = $row.find("td").last();
        const pitchers = pitcherCell.find(".pit");
        let winPitcher = "";
        let losePitcher = "";

        pitchers.each((i, el) => {
          const text = $(el).text().trim();
          if (text.startsWith("勝：")) {
            winPitcher = text.replace("勝：", "").trim();
          } else if (text.startsWith("敗：")) {
            losePitcher = text.replace("敗：", "").trim();
          }
        });

        const homeScore =
          score1Text !== "" ? parseInt(score1Text, 10) : null;
        const awayScore =
          score2Text !== "" ? parseInt(score2Text, 10) : null;

        // 結果判定
        let result: GameResult["result"] = "scheduled";
        if (isCancelled) {
          result = "cancelled";
        } else if (homeScore !== null && awayScore !== null) {
          const isDragonsHome = team1Text === "中日";
          const dragonsScore = isDragonsHome ? homeScore : awayScore;
          const opponentScore = isDragonsHome ? awayScore : homeScore;

          if (dragonsScore > opponentScore) {
            result = "win";
          } else if (dragonsScore < opponentScore) {
            result = "loss";
          } else {
            result = "draw";
          }
        }

        allGames.push({
          date: currentDate,
          homeTeam: team1Text,
          awayTeam: team2Text,
          homeScore,
          awayScore,
          venue,
          result,
          winPitcher,
          losePitcher,
        });
      });
    }

    return NextResponse.json({
      games: allGames,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch Dragons results:", error);
    return NextResponse.json(
      { error: "Failed to fetch game data" },
      { status: 500 }
    );
  }
}
