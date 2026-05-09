import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * FinalOverlay — Luxury cinematic love ending scene.
 *
 * Appears over the frozen last video frame with:
 * - Horizontal card carousel with photos from /srcc/
 * - Love message paper with Arabic calligraphy
 * - Left/right navigation arrows
 * - Touch swipe support
 *
 * PERFORMANCE:
 * - Images lazy-loaded via loading="lazy"
 * - Carousel uses transform: translateX (GPU-composited)
 * - Card transitions use transform + opacity only
 * - Paper text uses opacity-only fade transitions
 */

// ── Image + Message Data ──────────────────────────────────────────
// Each image from /srcc/ paired with a romantic Arabic love message
const SLIDES = [
  {
    image: "/src/pic1.jpeg",
    message: "أنتِ أجمل صدفة حصلت في حياتي\nكل لحظة معاكِ بتبقى ذكرى مبنسهاش أبداً",
  },
  {
    image: "/src/pic2.jpeg",
    message: "من يوم ما عرفتك وأنا حاسس إن الدنيا بقت أحلى\nعيونك هي البيت اللي دايمًا بلاقي فيه الأمان",
  },
  {
    image: "/src/pic3.jpeg",
    message: "كل ضحكة منك بتملا الدنيا نور\nوكل يوم بيعدي معاكِ بيبقى أحلى من اللي قبله",
  },
  {
    image: "/src/pic4.jpeg",
    message: "لو الحب كان شخص… كان هيكون إنتِ\nبحبك بكل حاجة فيّا، وبكل حاجة فيكِ",
  },
  {
    image: "/src/pic5.jpeg",
    message: "إنتِ مش بس حبيبتي\nإنتِ صاحبتي، عيلتي، ومكاني الآمن في الدنيا دي",
  },
  {
    image: "/src/pic6.jpeg",
    message: "بحلم بيوم نفضل فيه جنب بعض للأبد\nمن غير ما حاجة تبعدنا عن بعض",
  },
  {
    image: "/src/pic7.jpeg",
    message: "كل صورة معاكِ بتحكي قصة\nوكل قصة فيها حب مش بيخلص",
  },
  {
    image: "/src/pic8.jpeg",
    message: "ربنا كرمني بيكِ\nوأنا كل يوم بشكره إنه حطك في طريقي",
  },
  {
    image: "/src/pic9.jpeg",
    message: "يا أحلى عيد ميلاد في الدنيا\nكل سنة وإنتِ معايا… وكل سنة وإنتِ أجمل",
  },
  {
    image: "/src/pic10.jpeg",
    message: "مهما الأيام تعدي\nإنتِ هتفضلي الحاجة الوحيدة اللي قلبي مش هيتخلى عنها",
  },
  {
    image: "/src/pic12.jpeg",
    message: "كل سنة وأنتِ نور عينيّا\nعيد ميلاد سعيد يا أغلى إنسانة في حياتي ❤️",
  },
];

interface FinalOverlayProps {
  onExit?: () => void;
}

export function FinalOverlay({ onExit }: FinalOverlayProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = SLIDES.length;

  const goNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, total]);

  const goPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, total]);

  // Touch swipe support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const currentSlide = SLIDES[activeIndex];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Exit Button */}
      <button
        onClick={onExit}
        className={cn(
          "absolute top-6 right-6 z-50",
          "w-10 h-10 rounded-full flex items-center justify-center",
          "bg-black/50 border border-white/20",
          "text-rose-100 hover:text-white hover:bg-black/70",
          "transition-all duration-300 cursor-pointer shadow-lg",
          "hover:scale-110 active:scale-95"
        )}
      >
        <X size={20} strokeWidth={2.5} />
      </button>

      {/* Dark rose overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/70 via-bg-rose-dark/60 to-bg-dark/80 pointer-events-none" />

      {/* Extra vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(8,4,6,0.6)_100%)]" />

      {/* ── LEFT ARROW ──────────────────────────────── */}
      <button
        onClick={goPrev}
        className={cn(
          "absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-50",
          "w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center",
          "bg-black/40 border border-white/10",
          "text-rose-100/70 hover:text-rose-50",
          "hover:bg-black/60",
          "transition-[transform,opacity] duration-500 cursor-pointer",
          "hover:scale-110 active:scale-95"
        )}
      >
        <ChevronLeft size={24} strokeWidth={1.5} />
      </button>

      {/* ── RIGHT ARROW ─────────────────────────────── */}
      <button
        onClick={goNext}
        className={cn(
          "absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-50",
          "w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center",
          "bg-black/40 border border-white/10",
          "text-rose-100/70 hover:text-rose-50",
          "hover:bg-black/60",
          "transition-[transform,opacity] duration-500 cursor-pointer",
          "hover:scale-110 active:scale-95"
        )}
      >
        <ChevronRight size={24} strokeWidth={1.5} />
      </button>

      {/* ── CARD CAROUSEL ───────────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl px-16 md:px-20 flex items-center justify-center mb-6 md:mb-8">
        <div className="relative w-full flex items-center justify-center" style={{ perspective: "1000px" }}>
          {SLIDES.map((slide, i) => {
            const offset = i - activeIndex;
            // Wrap-around for infinite feel
            const wrappedOffset =
              offset > total / 2 ? offset - total :
              offset < -total / 2 ? offset + total :
              offset;

            const isActive = wrappedOffset === 0;
            const isVisible = Math.abs(wrappedOffset) <= 2;

            if (!isVisible) return null;

            return (
              <div
                key={i}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  left: "50%",
                  transform: `
                    translateX(calc(-50% + ${wrappedOffset * 220}px))
                    translateZ(${isActive ? 0 : -100}px)
                    rotateY(${wrappedOffset * -8}deg)
                    scale(${isActive ? 1 : 0.75})
                  `,
                  opacity: isActive ? 1 : Math.max(0, 0.5 - Math.abs(wrappedOffset) * 0.15),
                  zIndex: isActive ? 20 : 10 - Math.abs(wrappedOffset),
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div
                  className={cn(
                    "w-56 h-72 md:w-72 md:h-96 rounded-2xl overflow-hidden",
                    "border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
                    isActive && "shadow-[0_20px_60px_rgba(196,90,112,0.3),0_0_30px_rgba(245,198,208,0.15)]"
                  )}
                >
                  <img
                    src={slide.image}
                    alt={`Memory ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Placeholder for carousel height */}
        <div className="w-56 h-72 md:w-72 md:h-96 pointer-events-none opacity-0" />
      </div>

      {/* ── Dot Indicators ──────────────────────────── */}
      <div className="relative z-10 flex items-center gap-2 mb-5 md:mb-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setActiveIndex(i);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            className={cn(
              "rounded-full transition-all duration-400 cursor-pointer",
              i === activeIndex
                ? "w-6 h-2 bg-rose-300/80"
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>

      {/* ── LOVE MESSAGE PAPER ──────────────────────── */}
      <div className="relative z-10 w-[85%] max-w-sm mx-auto">
        <div
          className={cn(
            "relative px-6 pt-10 pb-5 md:px-8 md:pt-12 md:pb-6 rounded-lg",
            "bg-[#f4efea]", // Realistic warm parchment
            "border border-[#e0d6c8]",
            "shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(0,0,0,0.02)]",
            "transform rotate-[0.5deg]"
          )}
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(244,239,234,0.95) 0%, rgba(235,228,218,0.9) 100%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")
            `,
            backgroundBlendMode: "multiply",
          }}
        >
          {/* Pink Bow at the top */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
            🎀
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-rose-300 rounded-tl" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-rose-300 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-rose-300 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-rose-300 rounded-br" />

          {/* Message text — Arabic calligraphy */}
          <div
            key={activeIndex}
            className="text-center animate-fade-in"
            dir="rtl"
          >
            {currentSlide.message.split("\n").map((line, idx) => (
              <p
                key={idx}
                className={cn(
                  "font-ruqaa text-lg md:text-xl font-bold leading-relaxed",
                  "text-[#2a1f1d]",
                  idx > 0 && "mt-2"
                )}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Signature and page counter */}
          <div className="mt-6 mb-1 flex justify-between items-end" dir="rtl">
            <p className="font-ruqaa text-[#2a1f1d] font-bold text-lg md:text-xl drop-shadow-sm">
              مرسلة من زياد ❤️
            </p>
            <p className="text-rose-400 font-playfair text-xs md:text-sm tracking-[0.2em] font-semibold opacity-80">
              {activeIndex + 1} / {total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
