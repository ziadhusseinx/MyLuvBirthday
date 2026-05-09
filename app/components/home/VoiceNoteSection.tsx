import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * VoiceNoteSection — Audio player with waveform visualization.
 *
 * PERFORMANCE OPTIMIZATIONS v2:
 * - Removed Framer Motion entirely (was using motion.div for simple fade-in)
 * - Uses IntersectionObserver for CSS-class-based reveal instead
 * - Removed layout animation on progress bar (triggers layout recalculation)
 * - Progress bar uses transform: scaleX (GPU-composited) instead of width %
 * - Waveform bars use useMemo (generated once, never recomputed)
 * - Reduced waveform bars from 40 to 30
 * - Removed per-bar box-shadow (expensive on mobile)
 */

export function VoiceNoteSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for reveal animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => { setIsPlaying(false); setProgress(0); };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setProgress(percentage);
    }
  }, [duration]);

  // Generate waveform once — reduced to 30 bars, no box-shadow
  const waveformBars = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => {
      const height = Math.sin(i * 0.5) * 50 + Math.random() * 50 + 20;
      return height;
    }), []
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full py-32 z-20 flex flex-col items-center justify-center overflow-hidden",
        "transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/voices/voice.mp3" preload="metadata" />

      {/* Title */}
      <div className={cn(
        "text-center mb-16 transition-all duration-1000 delay-200",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      )}>
        <h3 className="font-cormorant italic text-3xl md:text-4xl text-rose-200/60 tracking-[0.3em] font-light drop-shadow-[0_0_15px_rgba(245,198,208,0.2)]">
          Listen
        </h3>
      </div>

      {/* Voice Note Player Card */}
      <div className={cn(
        "relative w-full max-w-md mx-4 md:max-w-lg p-6 md:p-8 rounded-[2rem]",
        "bg-gradient-to-br from-[#1a0810]/80 to-[#080406]/90",
        "border border-rose-900/30",
        "shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
        "flex flex-col items-center z-10",
        "transition-all duration-1000 delay-300",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"
      )}>
        {/* Soft internal glow — static */}
        <div className="absolute inset-0 rounded-[2rem] pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(212,112,136,0.08)_0%,transparent_70%)]" />

        <div className="flex items-center w-full gap-4 md:gap-6 relative z-10">

          {/* Play/Pause Button — no hover shadow animation */}
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-rose-900/40 to-[#18060e] border border-rose-800/50 flex items-center justify-center text-rose-200 shadow-[0_0_20px_rgba(245,198,208,0.15)] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 md:w-7 md:h-7 fill-rose-200" />
            ) : (
              <Play className="w-6 h-6 md:w-7 md:h-7 fill-rose-200 ml-1" />
            )}
          </button>

          {/* Waveform / Progress */}
          <div className="flex-grow flex flex-col gap-2">
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              className="relative w-full h-10 flex items-center justify-between gap-[2px] cursor-pointer"
            >
              {waveformBars.map((height, i) => {
                const barProgress = i / waveformBars.length;
                const isActive = barProgress <= progress;
                return (
                  <div
                    key={i}
                    className="w-1 rounded-full transition-colors duration-200"
                    style={{
                      height: `${height}%`,
                      backgroundColor: isActive ? '#f5c6d0' : 'rgba(196, 90, 112, 0.2)',
                    }}
                  />
                );
              })}
            </div>

            {/* Progress line — uses transform scaleX (GPU) instead of width */}
            <div className="w-full h-[1px] bg-rose-900/20 relative mt-1 overflow-hidden rounded-full">
              <div
                className="absolute top-0 left-0 h-full w-full bg-rose-400/50 origin-left will-change-transform"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Romantic Arabic Caption */}
      <div className={cn(
        "mt-12 text-center transition-all duration-1000 delay-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      )}>
        <p className="font-ruqaa text-2xl md:text-3xl text-rose-100/90 drop-shadow-[0_0_10px_rgba(245,198,208,0.3)]" dir="rtl">
          "" كلمات الكون كلو متوفيش حبي ليكي ...""
        </p>
      </div>

    </section>
  );
}
