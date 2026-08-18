"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";

type SoundType = "click" | "hover" | "heart" | "confetti" | "success" | "whoosh";

interface SoundContextType {
  enabled: boolean;
  toggle: () => void;
  play: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

function createAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new AudioCtx();
}

function playTone(ctx: AudioContext, freq: number, duration: number, type: OscillatorType = "sine", volume = 0.1, delay = 0) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem("cp-sound");
      if (saved === "true") setEnabled(true);
    });
  }, []);

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext();
    }
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      if (!enabled) return;
      const ctx = ensureContext();
      if (!ctx) return;

      switch (type) {
        case "click":
          playTone(ctx, 800, 0.08, "sine", 0.06);
          playTone(ctx, 1200, 0.05, "sine", 0.04, 0.02);
          break;
        case "hover":
          playTone(ctx, 600, 0.04, "sine", 0.02);
          break;
        case "heart":
          playTone(ctx, 523, 0.15, "sine", 0.08);
          playTone(ctx, 659, 0.15, "sine", 0.08, 0.08);
          playTone(ctx, 784, 0.25, "sine", 0.1, 0.16);
          break;
        case "confetti":
          [523, 659, 784, 1047].forEach((f, i) => {
            playTone(ctx, f, 0.3, "triangle", 0.06, i * 0.08);
          });
          break;
        case "success":
          playTone(ctx, 523, 0.1, "sine", 0.08);
          playTone(ctx, 784, 0.2, "sine", 0.08, 0.1);
          break;
        case "whoosh":
          playTone(ctx, 200, 0.3, "sawtooth", 0.03);
          playTone(ctx, 400, 0.2, "sine", 0.04, 0.1);
          break;
      }
    },
    [enabled, ensureContext]
  );

  const toggle = useCallback(() => {
    setEnabled((e) => {
      const next = !e;
      localStorage.setItem("cp-sound", String(next));
      if (next) {
        const ctx = ensureContext();
        if (ctx) {
          setTimeout(() => playTone(ctx, 523, 0.1, "sine", 0.06), 50);
          setTimeout(() => playTone(ctx, 784, 0.15, "sine", 0.08), 150);
        }
      }
      return next;
    });
  }, [ensureContext]);

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
