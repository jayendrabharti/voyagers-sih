"use client";

import { useRef, useEffect, useCallback } from "react";

// Game configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FPS = 60;

// Game state interface
interface GameState {
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
  };
  keys: { [key: string]: boolean };
  gameRunning: boolean;
}

export default function RecycleRun({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    player: {
      x: CANVAS_WIDTH / 2 - 25,
      y: CANVAS_HEIGHT / 2 - 25,
      width: 50,
      height: 50,
      speed: 5,
    },
    keys: {},
    gameRunning: false,
  });
  const animationFrameRef = useRef<number | null>(null);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    gameStateRef.current.gameRunning = true;
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    gameStateRef.current.keys[e.code] = true;
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    gameStateRef.current.keys[e.code] = false;
  }, []);

  // Update game logic
  const updateGame = useCallback(() => {
    const gameState = gameStateRef.current;
    const { player, keys } = gameState;

    // Player movement
    if (keys["ArrowUp"] || keys["KeyW"]) {
      player.y = Math.max(0, player.y - player.speed);
    }
    if (keys["ArrowDown"] || keys["KeyS"]) {
      player.y = Math.min(
        CANVAS_HEIGHT - player.height,
        player.y + player.speed
      );
    }
    if (keys["ArrowLeft"] || keys["KeyA"]) {
      player.x = Math.max(0, player.x - player.speed);
    }
    if (keys["ArrowRight"] || keys["KeyD"]) {
      player.x = Math.min(CANVAS_WIDTH - player.width, player.x + player.speed);
    }
  }, []);

  // Render game
  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { player } = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = "#87CEEB"; // Sky blue background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw player
    ctx.fillStyle = "#FF6B6B"; // Red player
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw simple border
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw instructions
    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    ctx.fillText("Use WASD or Arrow keys to move", 10, 25);
  }, []);

  // Main game loop
  const gameLoop = useCallback(() => {
    if (!gameStateRef.current.gameRunning) return;

    updateGame();
    renderGame();

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, renderGame]);

  // Start game
  const startGame = useCallback(() => {
    initGame();
    gameLoop();
  }, [initGame, gameLoop]);

  // Stop game
  const stopGame = useCallback(() => {
    gameStateRef.current.gameRunning = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Setup event listeners and start game
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Start the game
    startGame();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      stopGame();
    };
  }, [handleKeyDown, handleKeyUp, startGame, stopGame]);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          border: "4px solid #333",
          backgroundColor: "#f0f0f0",
        }}
      />
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <p>Use WASD or Arrow keys to move the red square</p>
        <button
          onClick={startGame}
          style={{ margin: "5px", padding: "10px 20px" }}
        >
          Start Game
        </button>
        <button
          onClick={stopGame}
          style={{ margin: "5px", padding: "10px 20px" }}
        >
          Stop Game
        </button>
      </div>
    </div>
  );
}
