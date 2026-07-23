"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const DOG_WIDTH = 64;
const DOG_HEIGHT = 48;
const SCALE = 1.8;
const TOTAL_ROWS = 9;
const TOTAL_COLS = 8;

const SPRITES = {
  IDLE: 0,
  SIT: 1,
  RUN: 3,
  WALK: 4,
  BEG: 7,
  SLEEP: 8,
};

type Behavior = "WALK" | "RUN" | "IDLE" | "SIT" | "SLEEP" | "BEG";

interface Bone {
  id: number;
  x: number; // percentage (100 -> -20)
  height: number; // height in px from ground
}

interface ScorePop {
  id: number;
  x: number;
  y: number;
  text: string;
}

export function RetroGameScreen() {
  // Game state flags
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [bonesEaten, setBonesEaten] = useState(0);

  // Dog position & physics
  const [dogX, setDogX] = useState(15); // Percentage from left
  const [dogY, setDogY] = useState(0); // Height off ground (px)
  const [behavior, setBehavior] = useState<Behavior>("IDLE");
  const [barkText, setBarkText] = useState<string | null>(null);

  // Entities & visual score pops
  const [bones, setBones] = useState<Bone[]>([]);
  const [scorePops, setScorePops] = useState<ScorePop[]>([]);

  // Refs for physics loop, state tracking, & deduplication
  const containerRef = useRef<HTMLDivElement>(null);
  const isJumpingRef = useRef(false);
  const jumpYRef = useRef(0);
  const jumpVelRef = useRef(0);
  const isPlayingRef = useRef(false);
  const lastSpawnTimeRef = useRef(0);
  const eatenBoneIdsRef = useRef<Set<number>>(new Set());

  isPlayingRef.current = isPlaying;

  // Jump Trigger Function
  const triggerJump = useCallback(() => {
    if (!isPlayingRef.current) {
      // Start runner mode on first click/jump
      setIsPlaying(true);
      setScore(0);
      setBonesEaten(0);
      setDogX(12);
      setBehavior("RUN");
      setBones([]);
      eatenBoneIdsRef.current.clear();
      lastSpawnTimeRef.current = Date.now();
    }

    if (!isJumpingRef.current) {
      isJumpingRef.current = true;
      jumpVelRef.current = 12;
      jumpYRef.current = 2;
      setDogY(2);
    }
  }, []);

  // Keyboard listener (Spacebar or Up Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerJump]);

  // Start / Pause Game toggle
  const handleStartToggle = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      setBehavior("IDLE");
      setDogX(15);
      setDogY(0);
      setBones([]);
      eatenBoneIdsRef.current.clear();
      isJumpingRef.current = false;
      jumpYRef.current = 0;
    } else {
      setIsPlaying(true);
      setScore(0);
      setBonesEaten(0);
      setBehavior("RUN");
      setDogX(12);
      setDogY(0);
      setBones([]);
      eatenBoneIdsRef.current.clear();
      isJumpingRef.current = false;
      jumpYRef.current = 0;
      lastSpawnTimeRef.current = Date.now();
    }
  }, [isPlaying]);

  // Idle Behavior Machine (when NOT playing runner mode)
  useEffect(() => {
    if (isPlaying) return;

    const idleTimer = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.35) {
        setBehavior("IDLE");
        setBarkText(null);
      } else if (rand < 0.6) {
        setBehavior("SIT");
        setBarkText(null);
      } else if (rand < 0.8) {
        setBehavior("BEG");
        setBarkText("WOOF! 🐾");
        setTimeout(() => setBarkText(null), 1800);
      } else {
        setBehavior("SLEEP");
        setBarkText(null);
      }
    }, 3800);

    return () => clearInterval(idleTimer);
  }, [isPlaying]);

  // Game Loop (30ms tick for jump physics, bone movement & collision)
  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      // 1. Jump Physics Arc
      if (isJumpingRef.current) {
        jumpVelRef.current -= 0.85; // Gravity
        const nextY = jumpYRef.current + jumpVelRef.current;

        if (nextY <= 0) {
          jumpYRef.current = 0;
          jumpVelRef.current = 0;
          isJumpingRef.current = false;
          setDogY(0);
        } else {
          jumpYRef.current = nextY;
          setDogY(nextY);
        }
      }

      // 2. Spawn Bones
      const now = Date.now();
      if (now - lastSpawnTimeRef.current > 2000 + Math.random() * 1200) {
        lastSpawnTimeRef.current = now;
        const newBone: Bone = {
          id: now,
          x: 105, // Right side of screen
          height: 35 + Math.random() * 35, // Height: 35px - 70px above ground
        };
        setBones((prev) => [...prev, newBone]);
      }

      // 3. Move Bones & Detect Collision with Strict Deduplication
      setBones((prevBones) => {
        const nextBones: Bone[] = [];
        const currentDogJump = jumpYRef.current;

        for (const bone of prevBones) {
          const nextX = bone.x - 2.0; // Bone speed leftward

          // Collision Box: Bone X overlaps dog X zone (6% to 22%), and dog is jumping near bone height
          const inXZone = nextX >= 6 && nextX <= 22;
          const heightMatch = currentDogJump >= bone.height - 25;
          const alreadyEaten = eatenBoneIdsRef.current.has(bone.id);

          if (!alreadyEaten && inXZone && heightMatch && currentDogJump > 15) {
            // Guarantee exactly ONE score count per bone (even in React StrictMode)
            eatenBoneIdsRef.current.add(bone.id);

            setScore((s) => s + 100);
            setBonesEaten((b) => b + 1);

            // Trigger floating popup
            setScorePops((pops) => [
              ...pops,
              {
                id: Date.now() + Math.random(),
                x: 18,
                y: bone.height + 30,
                text: "+100 🦴",
              },
            ]);

            continue; // Skip adding to nextBones so it disappears upon collection
          }

          if (!alreadyEaten && nextX > -20) {
            nextBones.push({ ...bone, x: nextX });
          }
        }
        return nextBones;
      });

      // 4. Cleanup old popups
      setScorePops((pops) => pops.filter((p) => Date.now() - p.id < 900));
    }, 30); // 33 fps tick

    return () => clearInterval(gameInterval);
  }, [isPlaying]);

  // Sprite mapping helpers
  const getSpriteY = (rowIndex: number) =>
    `${(rowIndex / (TOTAL_ROWS - 1)) * 100}%`;

  const getCurrentSpriteRow = () => {
    if (isPlaying) return SPRITES.RUN;
    switch (behavior) {
      case "WALK":
        return SPRITES.WALK;
      case "RUN":
        return SPRITES.RUN;
      case "SIT":
        return SPRITES.SIT;
      case "BEG":
        return SPRITES.BEG;
      case "SLEEP":
        return SPRITES.SLEEP;
      default:
        return SPRITES.IDLE;
    }
  };

  const getSteps = () => (behavior === "SLEEP" ? 4 : 7);
  const getEndPosition = () => `-${getSteps() * DOG_WIDTH}px`;

  const getAnimDuration = () => {
    if (isPlaying || behavior === "RUN") return "0.4s";
    if (behavior === "WALK") return "0.8s";
    if (behavior === "BEG") return "0.6s";
    return "1.0s";
  };

  const formattedScore = String(score).padStart(4, "0");

  return (
    <div className="flex h-full w-full flex-col justify-between gap-3 p-1">
      {/* Console Top Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="font-mono text-2xl font-black tracking-tight text-[#232B26] sm:text-3xl">
            JOIN DOGDEX
          </h1>
          <div className="flex items-center gap-1.5 rounded-full border border-[#232B26] bg-white px-2 py-0.5 font-mono text-[9px] font-black uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPlaying ? "bg-[#34C759] animate-ping" : "bg-[#FF3B30] animate-pulse"
              }`}
            />
            <span>{isPlaying ? "RUNNING" : "POWER"}</span>
          </div>
        </div>
        <p className="font-mono text-[11px] font-bold text-[#232B26]/80">
          DOGDEX BOY • COLOR SCREEN
        </p>
      </div>

      {/* Main Game Screen Frame */}
      <div
        ref={containerRef}
        onClick={triggerJump}
        className="group relative my-2 flex flex-1 min-h-[280px] sm:min-h-[320px] w-full cursor-pointer overflow-hidden rounded-2xl border-4 border-[#0F380F] bg-[#9BBC0F] shadow-[inset_6px_6px_0px_rgba(15,56,15,0.7),inset_-4px_-4px_0px_rgba(155,188,15,0.4)] transition-all hover:brightness-105 active:scale-[0.995]"
        title="Click or press Space / UP / Button A to Jump & Eat Bones!"
      >
        {/* Retro Scanlines */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(15,56,15,0.12)_50%,transparent_50%)] bg-[length:100%_4px]" />

        {/* HUD Info Header */}
        <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between font-mono text-[10px] font-black text-[#0F380F] select-none">
          <span>SCORE: {formattedScore}</span>
          <span>
            {isPlaying
              ? `BONES: 🦴 x ${bonesEaten}`
              : "PRESS START TO RUN"}
          </span>
        </div>

        {/* Bark Speech Bubble */}
        {barkText && !isPlaying && (
          <div
            className="absolute z-30 rounded-lg border-2 border-[#0F380F] bg-white px-2 py-0.5 font-mono text-[10px] font-black text-[#0F380F] shadow-[2px_2px_0px_#0F380F] animate-bounce select-none"
            style={{
              left: `${dogX + 10}%`,
              bottom: "95px",
            }}
          >
            {barkText}
          </div>
        )}

        {/* Floating "+100 🦴" Score Popups */}
        {scorePops.map((pop) => (
          <div
            key={pop.id}
            className="absolute z-30 font-mono text-xs font-black text-[#0F380F] animate-bounce select-none"
            style={{
              left: `${pop.x}%`,
              bottom: `${pop.y}px`,
            }}
          >
            {pop.text}
          </div>
        ))}

        {/* Sliding Ground Line */}
        <div
          className={`absolute bottom-0 left-0 h-6 w-full border-t-2 border-dashed border-[#0F380F] bg-[#8BAC0F]/40 ${
            isPlaying ? "animate-ground-scroll" : ""
          }`}
        />

        {/* Spawned Bones Sliding Left (Lucide Bone SVG icon standard from DogBreedID_v2) */}
        {bones.map((bone) => (
          <div
            key={bone.id}
            className="absolute z-20 select-none"
            style={{
              left: `${bone.x}%`,
              bottom: `${bone.height}px`,
            }}
          >
            {/* Lucide Bone SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0F380F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 fill-[#8BAC0F] text-[#0F380F] drop-shadow-[2px_2px_0px_rgba(15,56,15,0.6)]"
            >
              <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 1 0 0 5 .5.5 0 0 1 .5.5 2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5l7-7z" />
            </svg>
          </div>
        ))}

        {/* Animated Dog Sprite Frame */}
        <div
          className="absolute select-none"
          style={{
            left: `${dogX}%`,
            bottom: `${10 + dogY}px`,
          }}
        >
          {/* Flip / Sprite Wrapper */}
          <div style={{ transform: "scaleX(-1)" }}>
            <div
              style={{
                width: DOG_WIDTH,
                height: DOG_HEIGHT,
                transform: `scale(${SCALE})`,
                transformOrigin: "bottom left",
                imageRendering: "pixelated",
                backgroundImage: "url('/Dogs-Remastered-02.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: `${TOTAL_COLS * 100}% ${TOTAL_ROWS * 100}%`,
                backgroundPositionY: getSpriteY(getCurrentSpriteRow()),
                // @ts-ignore
                "--end-pos": getEndPosition(),
                animation: `play-sprite ${getAnimDuration()} steps(${getSteps()}) infinite`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Game Console Controls Bar */}
      <div className="flex items-center justify-between pt-1">
        {/* Cross D-Pad */}
        <div className="relative h-11 w-11 select-none">
          {/* Horizontal Arm */}
          <div className="absolute top-3.5 left-0 flex h-4 w-11 items-center justify-between rounded-xs border-2 border-[#232B26] bg-[#232B26] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            <button
              type="button"
              aria-label="Move Left"
              onClick={() => setDogX((x) => Math.max(5, x - 4))}
              className="h-full w-4 cursor-pointer hover:bg-zinc-700 active:bg-zinc-900 focus-visible:outline-none"
            />
            <button
              type="button"
              aria-label="Move Right"
              onClick={() => setDogX((x) => Math.min(75, x + 4))}
              className="h-full w-4 cursor-pointer hover:bg-zinc-700 active:bg-zinc-900 focus-visible:outline-none"
            />
          </div>
          {/* Vertical Arm */}
          <div className="absolute top-0 left-3.5 flex h-11 w-4 flex-col items-center justify-between rounded-xs border-2 border-[#232B26] bg-[#232B26] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            <button
              type="button"
              aria-label="Jump / Up"
              onClick={triggerJump}
              className="h-4 w-full cursor-pointer hover:bg-zinc-700 active:bg-zinc-900 focus-visible:outline-none"
            />
            <button
              type="button"
              aria-label="Sit Action"
              onClick={() => setBehavior("SIT")}
              className="h-4 w-full cursor-pointer hover:bg-zinc-700 active:bg-zinc-900 focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Rubber Pill Buttons */}
        <div className="flex items-center gap-2 font-mono text-[9px] font-black text-[#232B26]">
          <button
            type="button"
            aria-label="Select Behavior Mode"
            onClick={() => {
              const modes: Behavior[] = ["IDLE", "SIT", "SLEEP", "WALK"];
              const nextIndex = (modes.indexOf(behavior) + 1) % modes.length;
              setBehavior(modes[nextIndex]);
            }}
            className="cursor-pointer rounded-full border border-[#232B26] bg-zinc-300 px-2 py-0.5 shadow-[1px_1px_0px_#232B26] transition-all hover:bg-zinc-200 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus-visible:outline-none"
          >
            SELECT
          </button>
          <button
            type="button"
            aria-label="Start Game"
            onClick={handleStartToggle}
            className={`cursor-pointer rounded-full border border-[#232B26] px-2 py-0.5 shadow-[1px_1px_0px_#232B26] transition-all hover:bg-zinc-200 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus-visible:outline-none ${
              isPlaying ? "bg-[#34C759] text-white" : "bg-zinc-300"
            }`}
          >
            {isPlaying ? "PAUSE" : "START"}
          </button>
        </div>

        {/* Action Buttons A/B */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="B Button - Bark"
            onClick={() => {
              setBehavior("BEG");
              setBarkText("WOOF! 🐾");
              setTimeout(() => setBarkText(null), 1800);
            }}
            className="btn-brutal flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#232B26] bg-[#FF3B30] text-xs font-black text-white shadow-[2px_2px_0px_#232B26] transition-all hover:bg-[#E03126] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus-visible:outline-none"
          >
            B
          </button>
          <button
            type="button"
            aria-label="A Button - Jump"
            onClick={triggerJump}
            className="btn-brutal flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#232B26] bg-[#FF6B00] text-xs font-black text-white shadow-[2px_2px_0px_#232B26] transition-all hover:bg-[#E56000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus-visible:outline-none"
          >
            A
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes play-sprite {
          from {
            background-position-x: 0px;
          }
          to {
            background-position-x: var(--end-pos);
          }
        }
        @keyframes ground-scroll {
          0% {
            background-position-x: 0px;
          }
          100% {
            background-position-x: -40px;
          }
        }
        .animate-ground-scroll {
          animation: ground-scroll 0.35s linear infinite;
        }
      `}</style>
    </div>
  );
}
