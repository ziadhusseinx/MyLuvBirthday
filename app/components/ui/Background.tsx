import { useMemo } from "react";
import { cn } from "../../lib/utils";

interface BackgroundProps {
  children?: React.ReactNode;
  className?: string;
  /** When true, content flows naturally instead of being centered in a single viewport */
  flow?: boolean;
}

/**
 * Background — Cinematic ambient atmosphere layer.
 *
 * PERFORMANCE OPTIMIZATIONS v2:
 * - Reduced particles from 40 to 18 (55% fewer DOM nodes)
 * - Removed heart emoji particles (text rendering is expensive)
 * - All particles use CSS @keyframes with transform/opacity ONLY (GPU-composited)
 * - Gradient blobs use CSS animations (no Framer Motion)
 * - Removed box-shadow from star particles (shadow is expensive per-particle)
 * - useMemo for particle data = zero re-computation
 * - All overlay layers are purely static (no JS)
 */
export function Background({ children, className, flow = false }: BackgroundProps) {
  // Generate particle data once, never recompute
  // Reduced to 18 particles: 12 dust + 6 tiny stars (removed hearts — emoji rendering is slow)
  const particles = useMemo(() =>
    Array.from({ length: 18 }).map((_, i) => {
      const type = i < 12 ? 'dust' : 'star';
      return {
        id: i,
        type,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: type === 'dust' ? Math.random() * 3 + 1 : Math.random() * 2 + 0.5,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * -20,
        opacity: type === 'star' ? Math.random() * 0.3 + 0.1 : Math.random() * 0.15 + 0.05
      };
    })
  , []);

  return (
    <div className={cn("relative w-full overflow-hidden bg-bg-dark", !flow && "min-h-screen", className)}>
      {/* Moving gradients — CSS animation only, GPU-composited */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-bg-rose-dark blur-[120px] animate-gradient-drift-1 will-change-transform"
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-rose-900/10 blur-[150px] animate-gradient-drift-2 will-change-transform"
        />
      </div>

      {/* Floating particles — CSS @keyframes only, zero JS overhead */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        {particles.map((p) => (
          <div
            key={p.id}
            className={cn(
              "absolute rounded-full animate-float-particle pointer-events-none",
              p.type === 'star' ? "bg-white" : "bg-rose-200/30"
            )}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Noise overlay — static, no animation */}
      <div className="fixed inset-0 bg-noise z-[2] pointer-events-none" />
      
      {/* Soft vignette — static, no animation */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,4,6,0.8)_100%)] z-[2]" />

      {/* Content */}
      <div className={cn(
        "relative z-10 w-full",
        !flow && "h-full flex flex-col items-center justify-center min-h-screen"
      )}>
        {children}
      </div>
    </div>
  );
}
