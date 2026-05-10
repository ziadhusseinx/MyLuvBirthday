import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * CinematicVideo — Apple-style scroll-driven frame sequence renderer.
 *
 * ARCHITECTURE:
 * - Renders WebP frames from /frames/frame_NNNN.webp onto a single <canvas>
 * - Zero React state updates during scrolling — all DOM via refs
 * - requestAnimationFrame loop ONLY runs while section is scroll-locked
 * - Intelligent preloading: nearby frames first, then expanding outward
 * - Smooth interpolation between target and rendered frame
 * - Canvas drawImage is GPU-accelerated in all modern browsers
 *
 * PERFORMANCE:
 * - Single canvas element (no DOM churn)
 * - Preloaded Image objects cached in memory
 * - Frame switching = single drawImage call (~0.1ms)
 * - All UI updates via direct ref manipulation
 * - Passive listeners where safe, non-passive only for preventDefault
 */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// ── Configuration ─────────────────────────────────────────────────
const TOTAL_FRAMES = 120; // Adjust to match your actual frame count
const FRAME_PATH = "/frames/frame_"; // e.g. /frames/frame_0001.webp
const PRELOAD_AHEAD = isMobile ? 15 : 30; // How many frames to preload around current
const SCROLL_SENSITIVITY = 0.0006;
const TOUCH_SENSITIVITY = 0.0008;
const MAX_DELTA_PER_EVENT = 0.015;
const PROGRESS_LERP = isMobile ? 0.18 : 0.12;

function getFrameSrc(index: number): string {
  const padded = String(Math.max(1, Math.min(TOTAL_FRAMES, index))).padStart(4, "0");
  return `${FRAME_PATH}${padded}.webp`;
}

interface CinematicVideoProps {
  children?: React.ReactNode;
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
}

export function CinematicVideo({ children, onNavigateUp, onNavigateDown }: CinematicVideoProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // All mutable state in refs — zero re-renders during scrubbing
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const currentFrameRef = useRef(0);
  const isLockedRef = useRef(false);
  const isCompleteRef = useRef(false);
  const rafRef = useRef(0);
  const touchYRef = useRef(0);
  const isTickingRef = useRef(false);

  // Frame cache: preloaded Image objects
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const loadingRef = useRef<Set<number>>(new Set());

  // UI refs for direct DOM manipulation
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const navDownRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── FRAME PRELOADER ───────────────────────────────────────────────
  const preloadFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
    if (index < 1 || index > TOTAL_FRAMES) return Promise.resolve(null);
    if (framesRef.current[index]) return Promise.resolve(framesRef.current[index]);
    if (loadingRef.current.has(index)) return Promise.resolve(null);

    loadingRef.current.add(index);

    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        framesRef.current[index] = img;
        loadingRef.current.delete(index);
        resolve(img);
      };
      img.onerror = () => {
        loadingRef.current.delete(index);
        resolve(null);
      };
      img.src = getFrameSrc(index);
    });
  }, []);

  // Preload a window of frames around the current position
  const preloadAround = useCallback((centerFrame: number) => {
    // Priority: current frame first, then expanding outward
    preloadFrame(centerFrame);
    for (let offset = 1; offset <= PRELOAD_AHEAD; offset++) {
      preloadFrame(centerFrame + offset);
      preloadFrame(centerFrame - offset);
    }
  }, [preloadFrame]);

  // ── CANVAS RENDERER ───────────────────────────────────────────────
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = framesRef.current[frameIndex];
    if (!img) return;

    // Resize canvas to match display size (only when needed)
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const bufferWidth = Math.round(displayWidth * dpr);
    const bufferHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
    }

    // Cover-fit the image (like object-fit: cover)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = bufferWidth / bufferHeight;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgRatio > canvasRatio) {
      // Image is wider — crop sides
      sw = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      // Image is taller — crop top/bottom
      sh = img.naturalWidth / canvasRatio;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, bufferWidth, bufferHeight);
  }, []);

  // ── SCROLL LOCK / UNLOCK ──────────────────────────────────────────
  const lockScroll = useCallback(() => {
    if (isLockedRef.current) return;
    isLockedRef.current = true;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    if (!isTickingRef.current) {
      isTickingRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const unlockScroll = useCallback(() => {
    if (!isLockedRef.current) return;
    isLockedRef.current = false;
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    isTickingRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  const goUp = useCallback(() => {
    unlockScroll();
    targetProgressRef.current = 0;
    progressRef.current = 0;
    if (onNavigateUp) {
      onNavigateUp();
    } else {
      const section = sectionRef.current;
      if (section) {
        const prev = section.previousElementSibling as HTMLElement | null;
        if (prev) prev.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [unlockScroll, onNavigateUp]);

  const goDown = useCallback(() => {
    unlockScroll();
    if (onNavigateDown) {
      onNavigateDown();
    } else {
      const section = sectionRef.current;
      if (section) {
        const next = section.nextElementSibling as HTMLElement | null;
        if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [unlockScroll, onNavigateDown]);

  // ── rAF LOOP — runs ONLY while locked ─────────────────────────────
  const tick = useCallback(() => {
    if (!isTickingRef.current) return;

    // Smooth the raw scroll target
    progressRef.current = lerp(progressRef.current, targetProgressRef.current, PROGRESS_LERP);
    if (Math.abs(progressRef.current - targetProgressRef.current) < 0.0005) {
      progressRef.current = targetProgressRef.current;
    }

    // Map progress (0–1) to frame index (1–TOTAL_FRAMES)
    const targetFrame = Math.round(progressRef.current * (TOTAL_FRAMES - 1)) + 1;

    // Only redraw when frame actually changes
    if (targetFrame !== currentFrameRef.current) {
      currentFrameRef.current = targetFrame;
      drawFrame(targetFrame);

      // Preload frames around the new position
      preloadAround(targetFrame);
    }

    // Update progress bar — transform only (GPU)
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${progressRef.current})`;
    }

    // Fade title out — opacity only (GPU)
    if (titleRef.current) {
      const titleOpacity = Math.max(0, 1 - progressRef.current * 5);
      titleRef.current.style.opacity = String(titleOpacity);
    }

    // Show/hide nav + overlay — only on state change
    const complete = progressRef.current >= 0.99;
    if (complete !== isCompleteRef.current) {
      isCompleteRef.current = complete;
      if (navDownRef.current) {
        navDownRef.current.style.opacity = complete ? "1" : "0";
        navDownRef.current.style.pointerEvents = complete ? "auto" : "none";
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = complete ? "1" : "0";
        overlayRef.current.style.pointerEvents = complete ? "auto" : "none";
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame, preloadAround]);

  // ── SCROLL EVENT HANDLERS ─────────────────────────────────────────
  const normalizeDelta = useCallback((deltaY: number, deltaMode: number): number => {
    let normalized = deltaY;
    if (deltaMode === 1) normalized *= 40;
    if (deltaMode === 2) normalized *= 800;
    return Math.sign(normalized) * Math.min(Math.abs(normalized), 150);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isLockedRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const normalizedDelta = normalizeDelta(e.deltaY, e.deltaMode);
    const rawDelta = normalizedDelta * SCROLL_SENSITIVITY;
    const delta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), MAX_DELTA_PER_EVENT);

    const newTarget = targetProgressRef.current + delta;

    if (newTarget < -0.03) {
      targetProgressRef.current = 0;
      progressRef.current = 0;
      goUp();
      return;
    }

    if (newTarget > 1.05 && isCompleteRef.current) {
      goDown();
      return;
    }

    targetProgressRef.current = Math.max(0, Math.min(1, newTarget));
  }, [goUp, goDown, normalizeDelta]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isLockedRef.current) return;
    touchYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isLockedRef.current) return;
    e.preventDefault();

    const currentY = e.touches[0].clientY;
    const rawDelta = (touchYRef.current - currentY) * TOUCH_SENSITIVITY;
    touchYRef.current = currentY;

    const delta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), MAX_DELTA_PER_EVENT);
    const newTarget = targetProgressRef.current + delta;

    if (newTarget < -0.03) {
      targetProgressRef.current = 0;
      progressRef.current = 0;
      goUp();
      return;
    }

    if (newTarget > 1.05 && isCompleteRef.current) {
      goDown();
      return;
    }

    targetProgressRef.current = Math.max(0, Math.min(1, newTarget));
  }, [goUp, goDown]);

  // ── INTERSECTION OBSERVER: lock when section enters ───────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            lockScroll();
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      },
      { threshold: [0.5] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [lockScroll]);

  // ── INITIAL PRELOAD + EVENT LISTENERS ─────────────────────────────
  useEffect(() => {
    // Preload the first batch of frames immediately
    preloadAround(1);

    // Draw frame 1 once it's loaded
    preloadFrame(1).then((img) => {
      if (img) {
        currentFrameRef.current = 1;
        drawFrame(1);
      }
    });

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove as any);
      cancelAnimationFrame(rafRef.current);
      isTickingRef.current = false;
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, preloadAround, preloadFrame, drawFrame]);

  // Reduced particles
  const particles = useMemo(() =>
    Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 4,
    }))
  , []);

  return (
    <section
      ref={sectionRef}
      id="cinematic-video"
      className="relative w-full h-screen overflow-hidden bg-bg-dark"
    >
      {/* Canvas — GPU-accelerated frame renderer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ transform: "translateZ(0)" }}
      />

      {/* Cinematic vignette — static */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,4,6,0.75)_100%)] z-10" />

      {/* Edge blends — static */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bg-dark/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-dark/80 to-transparent pointer-events-none z-10" />

      {/* Rose atmosphere — static */}
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply bg-gradient-to-br from-transparent via-rose-900/8 to-transparent z-10" />

      {/* Noise — static */}
      <div className="absolute inset-0 bg-noise z-10" />

      {/* Particles — CSS only */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-rose-200/25 animate-float-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Title — opacity faded via ref */}
      <h2
        ref={titleRef}
        className={cn(
          "absolute top-12 md:top-16 left-0 right-0 text-center px-4 z-30",
          "font-cormorant italic text-2xl md:text-4xl font-light tracking-[0.15em] text-rose-50/80",
          "drop-shadow-[0_0_20px_rgba(245,198,208,0.2)]"
        )}
      >
        A journey through our memories…
      </h2>

      {/* Progress bar — GPU transform only */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-rose-300/60 to-rose-500/60 origin-left will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Nav: Back */}
      <button
        onClick={goUp}
        className={cn(
          "absolute top-6 left-1/2 -translate-x-1/2 z-40",
          "w-10 h-10 rounded-full flex items-center justify-center text-rose-100/70",
          "bg-black/40 border border-white/10",
          "shadow-[0_4px_15px_rgba(0,0,0,0.3)]",
          "hover:bg-black/60 hover:text-rose-50",
          "transition-[transform,opacity] duration-500 cursor-pointer",
          "opacity-70 hover:opacity-100 hover:scale-105"
        )}
      >
        <ChevronUp size={24} strokeWidth={1.5} />
      </button>

      {/* Nav: Continue */}
      <button
        ref={navDownRef}
        onClick={goDown}
        className={cn(
          "absolute bottom-8 left-0 right-0 mx-auto w-fit z-40",
          "w-12 h-12 rounded-full flex items-center justify-center text-rose-50",
          "bg-black/40 border border-white/15",
          "shadow-[0_8px_25px_rgba(245,198,208,0.15)]",
          "hover:bg-black/60",
          "transition-[transform,opacity] duration-500 cursor-pointer",
          "opacity-0 pointer-events-none animate-gentle-bounce",
          "hover:scale-105"
        )}
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </button>

      {/* Children overlay (FinalOverlay) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-30 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-1000"
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onExit: goUp } as any);
          }
          return child;
        })}
      </div>
    </section>
  );
}
