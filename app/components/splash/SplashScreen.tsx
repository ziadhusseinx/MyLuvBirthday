import { useState } from "react";
import confetti from "canvas-confetti";
import { Background } from "../ui/Background";
import { Lock } from "./Lock";

/**
 * SplashScreen — Entry point with lock interaction.
 *
 * PERFORMANCE OPTIMIZATIONS v2:
 * - Removed Framer Motion entirely (was AnimatePresence + motion.div)
 * - Uses CSS transitions for fade-in/out instead
 * - Reduced confetti particle count from 5+5 per frame to 3+3
 * - Confetti duration reduced from 3000ms to 2000ms
 * - Glow animation uses CSS @keyframes (hero-glow-pulse) instead of Framer animate
 * - Flash overlay uses CSS animation instead of motion.div
 */

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleSuccess = () => {
    setIsUnlocked(true);

    // Fire confetti — reduced particle count
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#f5c6d0", "#e8a0b0", "#d47088", "#ffffff"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#f5c6d0", "#e8a0b0", "#d47088", "#ffffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Transition to home after a delay
    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 800);
    }, 2000);
  };

  if (isFadingOut) return null;

  return (
    <div
      className="fixed inset-0 z-50 transition-opacity duration-1000"
      style={{ opacity: isFadingOut ? 0 : 1 }}
    >
      <Background>
        <div className="w-full max-w-4xl px-4 flex flex-col items-center justify-center">
          {/* Title Section — CSS animation */}
          <div className="text-center mb-16 md:mb-24 splash-title-appear">
            <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.2em] md:tracking-[0.3em] text-rose-50 hero-glow-pulse drop-shadow-[0_0_30px_rgba(245,198,208,0.3)]">
              <span className="block mb-2 text-rose-100/80 font-light text-2xl md:text-3xl tracking-[0.4em]">
                HAPPY BIRTHDAY
              </span>
              RAHMA
            </h1>
          </div>

          {/* Lock Section */}
          <Lock isUnlocked={isUnlocked} onSuccess={handleSuccess} />

          {/* Unlock Flash Effect — CSS only */}
          {isUnlocked && (
            <div className="fixed inset-0 pointer-events-none mix-blend-overlay z-50 splash-flash" />
          )}
        </div>
      </Background>
    </div>
  );
}
