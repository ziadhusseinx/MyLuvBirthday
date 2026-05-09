import { useMemo, useRef, useEffect } from "react";

/**
 * InteractiveScene — Premium cinematic hero section.
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - ZERO Framer Motion = zero JS per frame for ambient effects
 * - All particles use CSS @keyframes (GPU-composited, no JS)
 * - Removed useScroll/useTransform parallax (heavy on mobile)
 * - Replaced motion.div animated blurs with static CSS
 * - Glow pulses via CSS @keyframes instead of Framer animate
 * - All transforms use will-change and translateZ(0) for GPU layers
 * - Reduced particle count from 40 to 20 (halved DOM nodes)
 */

export function InteractiveScene() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -15,
    })), []
  );

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Atmospheric Background (Static CSS layers) ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Core cinematic bloom — static radial gradient, no animation cost */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(138,32,64,0.12)_0%,transparent_60%)] hero-bloom will-change-transform" />
      </div>

      {/* Floating Ambient Particles — Pure CSS animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-rose-200/20 animate-float-particle"
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

      {/* ── Central Art — Decorative rings (CSS-only rotation) ── */}
      <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        {/* Inner ring — static */}
        <div className="absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full border border-rose-300/8 hero-ring-appear" />
        {/* Outer orbit — CSS rotation only */}
        <div className="absolute w-[320px] h-[320px] md:w-[480px] md:h-[480px] rounded-full border-[0.5px] border-dashed border-rose-400/15 hero-orbit will-change-transform" />
      </div>

      {/* ── Typography & Main Content ── */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-6 mt-16 md:mt-24 pointer-events-none">

        {/* Title Group — CSS fade-in only */}
        <div className="relative flex flex-col items-center text-center hero-title-appear">

          {/* Glow behind text — static, no animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[150%] bg-[radial-gradient(ellipse,rgba(196,90,112,0.1)_0%,transparent_70%)] rounded-full hero-glow-pulse" />

          <h1 className="font-cormorant italic font-light flex flex-col items-center gap-3 md:gap-5">
            {/* English Pre-title */}
            <span className="text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] text-rose-100/90 drop-shadow-[0_0_15px_rgba(245,198,208,0.3)] hero-text-reveal" style={{ animationDelay: "0.3s" }}>
              Happy Birthday
            </span>

            {/* English Main Name */}
            <span
              className="font-vibes text-7xl md:text-[8rem] lg:text-[10rem] text-rose-50 tracking-wide relative mt-2 md:mt-4 hero-text-reveal"
              style={{ animationDelay: "0.8s" }}
            >
              <span className="relative z-10 drop-shadow-[0_0_30px_rgba(245,198,208,0.5)]">Rahma</span>
            </span>
          </h1>
        </div>

        {/* Elegant Divider — CSS scale animation */}
        <div className="w-28 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-rose-300/50 to-transparent my-10 md:my-14 hero-divider-reveal" />

        {/* Arabic Romantic Subtitle */}
        <div className="relative text-center max-w-2xl px-4 hero-text-reveal" style={{ animationDelay: "1.6s" }}>
          <p dir="rtl" className="font-ruqaa text-3xl md:text-4xl lg:text-5xl text-rose-200/90 leading-relaxed drop-shadow-[0_0_15px_rgba(245,198,208,0.2)]">
            كل سنة وانتي أجمل حكاية في حياتي
          </p>
        </div>
      </div>
    </div>
  );
}
