"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./BreakoutGame.module.css";

// ゲーム定数
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 7;
const BLOCK_ROWS = 6;
const BLOCK_COLS = 8;
const BLOCK_WIDTH = CANVAS_WIDTH / BLOCK_COLS - 6;
const BLOCK_HEIGHT = 20;
const BLOCK_PADDING = 4;
const BLOCK_OFFSET_TOP = 60;
const BLOCK_OFFSET_LEFT = (CANVAS_WIDTH - (BLOCK_WIDTH + BLOCK_PADDING) * BLOCK_COLS + BLOCK_PADDING) / 2;

const ROW_COLORS = ["#e10600", "#ff4136", "#ff851b", "#ffdc00", "#2ecc40", "#0074d9"];

interface Block {
  x: number;
  y: number;
  alive: boolean;
  color: string;
}

export default function BreakoutGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"ready" | "playing" | "won" | "lost">("ready");

  // ゲームの状態をrefで管理 (アニメーションループ内で最新値を参照するため)
  const gameRef = useRef({
    paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT - 50,
    ballDX: 4,
    ballDY: -4,
    blocks: [] as Block[],
    score: 0,
    state: "ready" as "ready" | "playing" | "won" | "lost",
  });

  // ブロック初期化
  const initBlocks = useCallback(() => {
    const blocks: Block[] = [];
    for (let r = 0; r < BLOCK_ROWS; r++) {
      for (let c = 0; c < BLOCK_COLS; c++) {
        blocks.push({
          x: BLOCK_OFFSET_LEFT + c * (BLOCK_WIDTH + BLOCK_PADDING),
          y: BLOCK_OFFSET_TOP + r * (BLOCK_HEIGHT + BLOCK_PADDING),
          alive: true,
          color: ROW_COLORS[r],
        });
      }
    }
    return blocks;
  }, []);

  // ゲームリセット
  const resetGame = useCallback(() => {
    const g = gameRef.current;
    g.paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
    g.ballX = CANVAS_WIDTH / 2;
    g.ballY = CANVAS_HEIGHT - 50;
    g.ballDX = 4 * (Math.random() > 0.5 ? 1 : -1);
    g.ballDY = -4;
    g.blocks = initBlocks();
    g.score = 0;
    g.state = "ready";
    setScore(0);
    setGameState("ready");
  }, [initBlocks]);

  // 描画ループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resetGame();

    const draw = () => {
      const g = gameRef.current;
      // 背景
      ctx.fillStyle = "#15151e";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // ブロック描画
      for (const block of g.blocks) {
        if (!block.alive) continue;
        ctx.fillStyle = block.color;
        // 角丸ブロック
        const r = 4;
        ctx.beginPath();
        ctx.moveTo(block.x + r, block.y);
        ctx.lineTo(block.x + BLOCK_WIDTH - r, block.y);
        ctx.quadraticCurveTo(block.x + BLOCK_WIDTH, block.y, block.x + BLOCK_WIDTH, block.y + r);
        ctx.lineTo(block.x + BLOCK_WIDTH, block.y + BLOCK_HEIGHT - r);
        ctx.quadraticCurveTo(block.x + BLOCK_WIDTH, block.y + BLOCK_HEIGHT, block.x + BLOCK_WIDTH - r, block.y + BLOCK_HEIGHT);
        ctx.lineTo(block.x + r, block.y + BLOCK_HEIGHT);
        ctx.quadraticCurveTo(block.x, block.y + BLOCK_HEIGHT, block.x, block.y + BLOCK_HEIGHT - r);
        ctx.lineTo(block.x, block.y + r);
        ctx.quadraticCurveTo(block.x, block.y, block.x + r, block.y);
        ctx.closePath();
        ctx.fill();
      }

      // パドル描画
      ctx.fillStyle = "#fff";
      const pr = 6;
      ctx.beginPath();
      ctx.moveTo(g.paddleX + pr, CANVAS_HEIGHT - 30);
      ctx.lineTo(g.paddleX + PADDLE_WIDTH - pr, CANVAS_HEIGHT - 30);
      ctx.quadraticCurveTo(g.paddleX + PADDLE_WIDTH, CANVAS_HEIGHT - 30, g.paddleX + PADDLE_WIDTH, CANVAS_HEIGHT - 30 + pr);
      ctx.lineTo(g.paddleX + PADDLE_WIDTH, CANVAS_HEIGHT - 30 + PADDLE_HEIGHT - pr);
      ctx.quadraticCurveTo(g.paddleX + PADDLE_WIDTH, CANVAS_HEIGHT - 30 + PADDLE_HEIGHT, g.paddleX + PADDLE_WIDTH - pr, CANVAS_HEIGHT - 30 + PADDLE_HEIGHT);
      ctx.lineTo(g.paddleX + pr, CANVAS_HEIGHT - 30 + PADDLE_HEIGHT);
      ctx.quadraticCurveTo(g.paddleX, CANVAS_HEIGHT - 30 + PADDLE_HEIGHT, g.paddleX, CANVAS_HEIGHT - 30 + PADDLE_HEIGHT - pr);
      ctx.lineTo(g.paddleX, CANVAS_HEIGHT - 30 + pr);
      ctx.quadraticCurveTo(g.paddleX, CANVAS_HEIGHT - 30, g.paddleX + pr, CANVAS_HEIGHT - 30);
      ctx.closePath();
      ctx.fill();

      // ボール描画
      ctx.beginPath();
      ctx.arc(g.ballX, g.ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#e10600";
      ctx.fill();
      // ボールのグロー
      ctx.shadowColor = "#e10600";
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // スコア表示
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 16px 'Nunito', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${g.score}`, 12, 30);

      // ゲームロジック
      if (g.state === "playing") {
        g.ballX += g.ballDX;
        g.ballY += g.ballDY;

        // 壁反射 (左右)
        if (g.ballX - BALL_RADIUS <= 0 || g.ballX + BALL_RADIUS >= CANVAS_WIDTH) {
          g.ballDX = -g.ballDX;
        }
        // 壁反射 (上)
        if (g.ballY - BALL_RADIUS <= 0) {
          g.ballDY = -g.ballDY;
        }

        // パドル衝突
        if (
          g.ballY + BALL_RADIUS >= CANVAS_HEIGHT - 30 &&
          g.ballY + BALL_RADIUS <= CANVAS_HEIGHT - 30 + PADDLE_HEIGHT + 4 &&
          g.ballX >= g.paddleX &&
          g.ballX <= g.paddleX + PADDLE_WIDTH
        ) {
          g.ballDY = -Math.abs(g.ballDY);
          // パドルの当たった位置で角度変更
          const hitPos = (g.ballX - g.paddleX) / PADDLE_WIDTH;
          g.ballDX = 6 * (hitPos - 0.5);
        }

        // 落下 (ゲームオーバー)
        if (g.ballY + BALL_RADIUS > CANVAS_HEIGHT) {
          g.state = "lost";
          setGameState("lost");
        }

        // ブロック衝突
        for (const block of g.blocks) {
          if (!block.alive) continue;
          if (
            g.ballX + BALL_RADIUS > block.x &&
            g.ballX - BALL_RADIUS < block.x + BLOCK_WIDTH &&
            g.ballY + BALL_RADIUS > block.y &&
            g.ballY - BALL_RADIUS < block.y + BLOCK_HEIGHT
          ) {
            block.alive = false;
            g.ballDY = -g.ballDY;
            g.score += 10;
            setScore(g.score);
            break;
          }
        }

        // 全ブロック破壊 → 勝利
        if (g.blocks.every((b) => !b.alive)) {
          g.state = "won";
          setGameState("won");
        }
      }

      // 待機中メッセージ
      if (g.state === "ready") {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 20px 'Nunito', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Click to Start!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      }

      // ゲームオーバー/勝利メッセージ
      if (g.state === "lost" || g.state === "won") {
        ctx.fillStyle = "rgba(21, 21, 30, 0.75)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 32px 'Nunito', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(g.state === "won" ? "🎉 YOU WIN!" : "GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

        ctx.font = "18px 'Nunito', sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`Score: ${g.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

        ctx.fillStyle = "#e10600";
        ctx.font = "bold 16px 'Nunito', sans-serif";
        ctx.fillText("Click to Retry", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animRef.current);
  }, [resetGame]);

  // マウス操作
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const x = (e.clientX - rect.left) * scaleX - PADDLE_WIDTH / 2;
    gameRef.current.paddleX = Math.max(0, Math.min(x, CANVAS_WIDTH - PADDLE_WIDTH));
  }, []);

  // タッチ操作
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const x = (e.touches[0].clientX - rect.left) * scaleX - PADDLE_WIDTH / 2;
    gameRef.current.paddleX = Math.max(0, Math.min(x, CANVAS_WIDTH - PADDLE_WIDTH));
  }, []);

  // クリックでゲーム開始/リトライ
  const handleClick = useCallback(() => {
    const g = gameRef.current;
    if (g.state === "ready") {
      g.state = "playing";
      setGameState("playing");
    } else if (g.state === "lost" || g.state === "won") {
      resetGame();
      // 少し遅れて開始
      setTimeout(() => {
        gameRef.current.state = "playing";
        setGameState("playing");
      }, 100);
    }
  }, [resetGame]);

  // ESCで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>🧱 Block Breaker</h2>
          <span className={styles.score}>SCORE: {score}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={styles.canvas}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={handleClick}
        />
        <p className={styles.hint}>
          {gameState === "ready" && "キャンバスをクリックしてスタート！"}
          {gameState === "playing" && "マウス / タッチでパドルを操作"}
          {gameState === "won" && "🎉 全ブロック破壊！クリックでリトライ"}
          {gameState === "lost" && "クリックでリトライ"}
        </p>
      </div>
    </div>
  );
}
