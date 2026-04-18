import { useState, useEffect, useRef, useCallback } from "react";
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_TICK } from "../constants";

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
  };

  const wrapPosition = (pos: number) => {
    if (pos < 0) return GRID_SIZE - 1;
    if (pos >= GRID_SIZE) return 0;
    return pos;
  };

  const moveSnake = useCallback(() => {
    setSnake((prev) => {
      const head = prev[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case "UP": newHead.y -= 1; break;
        case "DOWN": newHead.y += 1; break;
        case "LEFT": newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
      }

      // Wrap around logic
      newHead.x = wrapPosition(newHead.x);
      newHead.y = wrapPosition(newHead.y);

      // Check collision with self
      if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, onScoreChange]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": if (directionRef.current !== "DOWN") directionRef.current = "UP"; break;
        case "ArrowDown": if (directionRef.current !== "UP") directionRef.current = "DOWN"; break;
        case "ArrowLeft": if (directionRef.current !== "RIGHT") directionRef.current = "LEFT"; break;
        case "ArrowRight": if (directionRef.current !== "LEFT") directionRef.current = "RIGHT"; break;
      }
      setDirection(directionRef.current);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Game loop
  useEffect(() => {
    let animationId: number;

    const loop = (timestamp: number) => {
      if (!isGameOver) {
        if (timestamp - lastUpdateRef.current > GAME_TICK) {
          moveSnake();
          lastUpdateRef.current = timestamp;
        }
        draw();
      }
      animationId = requestAnimationFrame(loop);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const cellSize = canvas.width / GRID_SIZE;

      // Clear
      ctx.fillStyle = "#020617"; // bg-slate-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = "rgba(14, 165, 233, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        const p = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(p, 0);
        ctx.lineTo(p, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, p);
        ctx.lineTo(canvas.width, p);
        ctx.stroke();
      }

      // Draw Food
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#84cc16"; // lime-500
      ctx.fillStyle = "#84cc16";
      ctx.beginPath();
      ctx.arc(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Snake
      snake.forEach((segment, i) => {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? "#22d3ee" : "rgba(34, 211, 238, 0.4)";
        ctx.shadowBlur = isHead ? 20 : 0;
        ctx.shadowColor = "#22d3ee";
        
        const padding = cellSize * 0.1;
        ctx.fillRect(
          segment.x * cellSize + padding,
          segment.y * cellSize + padding,
          cellSize - padding * 2,
          cellSize - padding * 2
        );
        ctx.shadowBlur = 0;
      });
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [moveSnake, snake, food, isGameOver]);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full max-w-[400px] aspect-square"
        />
        
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <h2 className="text-4xl font-black text-pink-500 mb-2 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              GAME OVER
            </h2>
            <p className="text-white/60 font-mono mb-8">FINAL SCORE: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-white text-slate-950 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between items-center px-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Grid System</span>
          <span className="text-cyan-400 font-mono text-sm leading-none">20x20 NEURAL</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Performance</span>
          <span className="text-pink-500 font-mono text-sm leading-none">60 FPS</span>
        </div>
      </div>
    </div>
  );
}
