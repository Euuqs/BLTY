"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
}

interface FeedbackContextType {
  spawnParticles: (x: number, y: number, type?: "hearts" | "sparkles", count?: number) => void;
  burstConfetti: (duration?: number) => void;
  createRipple: (event: React.MouseEvent<HTMLElement>, color?: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

const HEART_EMOJIS = ["\u2665", "\u2764", "\u{1F49C}", "\u{1F499}", "\u{1F496}"];
const SPARKLE_EMOJIS = ["\u2728", "\u2B50", "\u{1F31F}", "\u2727"];
const CONFETTI_COLORS = [
  "oklch(0.65 0.22 295)",
  "oklch(0.60 0.18 250)",
  "oklch(0.95 0.01 260)",
  "oklch(0.58 0.22 20)",
  "oklch(0.70 0.15 320)",
];

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const particleIdRef = useRef(0);

  const spawnParticles = useCallback(
    (x: number, y: number, type: "hearts" | "sparkles" = "hearts", count = 6) => {
      const emojis = type === "hearts" ? HEART_EMOJIS : SPARKLE_EMOJIS;
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 40 + Math.random() * 60;
        newParticles.push({
          id: particleIdRef.current++,
          x: x + Math.cos(angle) * distance * 0.3,
          y: y + Math.sin(angle) * distance * 0.3 - 20,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 1200);
    },
    []
  );

  const burstConfetti = useCallback((duration = 3000) => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: particleIdRef.current++,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    setConfetti(pieces);

    setTimeout(() => {
      setConfetti([]);
    }, duration);
  }, []);

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLElement>, color?: string) => {
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      if (color) ripple.style.background = color;

      element.classList.add("ripple-container");
      element.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
        if (!element.querySelector(".ripple")) {
          element.classList.remove("ripple-container");
        }
      }, 600);
    },
    []
  );

  return (
    <FeedbackContext.Provider value={{ spawnParticles, burstConfetti, createRipple }}>
      {children}
      {particles.map((p) => (
        <span
          key={p.id}
          className="heart-particle"
          style={{
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {p.emoji}
        </span>
      ))}
      {confetti.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.5,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: piece.size > 10 ? "50%" : "2px",
          }}
        />
      ))}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return context;
}
