"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Heart, Sparkle } from "@/components/mascot/Mascots";

interface Particle {
  id: number;
  x: number;
  y: number;
  kind: "heart" | "sparkle";
  color: string;
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

const HEART_COLORS = ["text-rose", "text-cp", "text-zhu", "text-bai"];
const SPARKLE_COLORS = ["text-white", "text-rose", "text-cp"];
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
      const colors = type === "hearts" ? HEART_COLORS : SPARKLE_COLORS;
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 40 + Math.random() * 60;
        newParticles.push({
          id: particleIdRef.current++,
          x: x + Math.cos(angle) * distance * 0.3,
          y: y + Math.sin(angle) * distance * 0.3 - 20,
          kind: type === "hearts" ? "heart" : "sparkle",
          color: colors[Math.floor(Math.random() * colors.length)],
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
      const computedStyle = window.getComputedStyle(element);
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      if (color) ripple.style.background = color;

      if (computedStyle.position === "static") {
        element.classList.add("ripple-container");
      }
      element.style.overflow = "hidden";
      element.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
        if (!element.querySelector(".ripple")) {
          if (computedStyle.position === "static") {
            element.classList.remove("ripple-container");
          }
          element.style.overflow = "";
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
          className={p.kind === "heart" ? "heart-particle" : "sparkle-particle"}
          style={{
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {p.kind === "heart" ? (
            <Heart className={"w-5 h-5 " + p.color} />
          ) : (
            <Sparkle className={"w-5 h-5 " + p.color} />
          )}
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
