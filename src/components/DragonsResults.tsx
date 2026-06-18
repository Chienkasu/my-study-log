"use client";
import { useState, useEffect } from "react";
import styles from "./DragonsResults.module.css";

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

interface ApiResponse {
  games: GameResult[];
  updatedAt: string;
}

const RESULT_LABELS: Record<GameResult["result"], string> = {
  win: "勝利",
  loss: "敗北",
  draw: "引分",
  cancelled: "中止",
  scheduled: "予定",
};

const RESULT_EMOJI: Record<GameResult["result"], string> = {
  win: "◯",
  loss: "●",
  draw: "△",
  cancelled: "ー",
  scheduled: "",
};

export default function DragonsResults() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/dragons");
        if (!res.ok) throw new Error("Failed to fetch");
        const json: ApiResponse = await res.json();
        setData(json);
      } catch {
        setError("試合データの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isOpen]);

  // 最新の試合結果（終了済み）を計算
  const recentGames =
    data?.games.filter(
      (g) => g.result === "win" || g.result === "loss" || g.result === "draw"
    ) ?? [];
  const wins = recentGames.filter((g) => g.result === "win").length;
  const losses = recentGames.filter((g) => g.result === "loss").length;
  const draws = recentGames.filter((g) => g.result === "draw").length;

  // 直近5試合の結果（表示用ストリーク）
  const lastFive = recentGames.slice(-5);

  return (
    <>
      <button
        className={styles.triggerButton}
        onClick={() => setIsOpen(true)}
        aria-label="中日ドラゴンズの試合結果を見る"
        id="dragons-trigger"
      >
        🐉 Dragons
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="中日ドラゴンズ試合結果"
          >
            {/* ヘッダー */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.teamLogo}>🐉</div>
                <div>
                  <h2 className={styles.teamName}>中日ドラゴンズ</h2>
                  <p className={styles.teamSub}>CHUNICHI DRAGONS</p>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>

            {/* コンテンツ */}
            <div className={styles.content}>
              {isLoading ? (
                <div className={styles.loadingArea}>
                  <div className={styles.spinner} />
                  <p>試合データを取得中...</p>
                </div>
              ) : error ? (
                <div className={styles.errorArea}>
                  <p>{error}</p>
                </div>
              ) : (
                <>
                  {/* スタッツカード */}
                  <div className={styles.statsRow}>
                    <div className={`${styles.statCard} ${styles.statWin}`}>
                      <span className={styles.statValue}>{wins}</span>
                      <span className={styles.statLabel}>勝</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.statLoss}`}>
                      <span className={styles.statValue}>{losses}</span>
                      <span className={styles.statLabel}>敗</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.statDraw}`}>
                      <span className={styles.statValue}>{draws}</span>
                      <span className={styles.statLabel}>分</span>
                    </div>
                  </div>

                  {/* 直近5試合のストリーク */}
                  {lastFive.length > 0 && (
                    <div className={styles.streakRow}>
                      <span className={styles.streakLabel}>直近5試合</span>
                      <div className={styles.streakDots}>
                        {lastFive.map((g, i) => (
                          <span
                            key={i}
                            className={`${styles.streakDot} ${styles[`dot_${g.result}`]}`}
                            title={`${g.date} ${g.result === "win" ? "勝" : g.result === "loss" ? "敗" : "分"}`}
                          >
                            {RESULT_EMOJI[g.result]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 試合一覧 */}
                  <div className={styles.gameList}>
                    {data?.games
                      .slice()
                      .reverse()
                      .map((game, i) => {
                        const isDragonsHome = game.homeTeam === "中日";
                        const opponent = isDragonsHome
                          ? game.awayTeam
                          : game.homeTeam;
                        const dragonsScore = isDragonsHome
                          ? game.homeScore
                          : game.awayScore;
                        const opponentScore = isDragonsHome
                          ? game.awayScore
                          : game.homeScore;

                        return (
                          <div
                            key={i}
                            className={`${styles.gameCard} ${styles[`game_${game.result}`]}`}
                          >
                            <div className={styles.gameDate}>{game.date}</div>
                            <div className={styles.gameMain}>
                              <div className={styles.gameTeams}>
                                <span className={styles.dragonsName}>
                                  中日
                                </span>
                                {game.result !== "cancelled" &&
                                game.result !== "scheduled" ? (
                                  <span className={styles.gameScore}>
                                    {dragonsScore} - {opponentScore}
                                  </span>
                                ) : (
                                  <span className={styles.gameStatus}>
                                    {RESULT_LABELS[game.result]}
                                  </span>
                                )}
                                <span className={styles.opponentName}>
                                  {opponent}
                                </span>
                              </div>
                              <div className={styles.gameMeta}>
                                <span className={styles.gameVenue}>
                                  📍 {game.venue}
                                </span>
                                {game.result !== "cancelled" &&
                                  game.result !== "scheduled" && (
                                    <span
                                      className={`${styles.gameResult} ${styles[`result_${game.result}`]}`}
                                    >
                                      {RESULT_LABELS[game.result]}
                                    </span>
                                  )}
                              </div>
                              {game.winPitcher && (
                                <div className={styles.pitchers}>
                                  <span className={styles.pitcherWin}>
                                    勝：{game.winPitcher}
                                  </span>
                                  {game.losePitcher && (
                                    <span className={styles.pitcherLoss}>
                                      敗：{game.losePitcher}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* 更新日時 */}
                  {data?.updatedAt && (
                    <p className={styles.updatedAt}>
                      最終更新：
                      {new Date(data.updatedAt).toLocaleString("ja-JP")}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
