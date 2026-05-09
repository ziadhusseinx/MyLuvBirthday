import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Heart } from "lucide-react";

export function FinalEnding() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Intersection observer for initial fade in
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(section);

    // Scroll listener for fading into darkness at the absolute bottom
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the user has scrolled through this specific section
      // 0 = top of section enters bottom of viewport
      // 1 = bottom of section hits bottom of viewport
      const totalScrollDistance = rect.height;
      const scrolledInPixels = windowHeight - rect.top;
      
      if (scrolledInPixels > 0 && scrolledInPixels <= totalScrollDistance) {
        let p = scrolledInPixels / totalScrollDistance;
        // Clamp between 0 and 1
        p = Math.max(0, Math.min(1, p));
        setProgress(p);
      } else if (scrolledInPixels > totalScrollDistance) {
        setProgress(1);
      } else {
        setProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate dynamic opacity for the fade-to-black effect at the very end
  // As progress approaches 1 (bottom of section), the background dims darker.
  const dimOpacity = Math.max(0, (progress - 0.7) * 3.33); // 0 to 1 in the last 30% of scroll

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[120vh] flex flex-col items-center justify-center overflow-hidden z-20"
      style={{
        backgroundColor: `rgba(8, 4, 6, ${dimOpacity})`,
        transition: "background-color 0.1s ease-out"
      }}
    >
      {/* ── Ambient Background Glow (Dreamy Rose Aura) ── */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none blur-[120px] transition-all duration-[3000ms] ease-in-out",
          isVisible ? "opacity-30 scale-100" : "opacity-0 scale-50",
          "bg-[radial-gradient(circle_at_center,#d47088_0%,transparent_70%)]"
        )}
      />

      {/* ── Particles Layer (Optimized CSS) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-60">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-rose-200/40 animate-end-particle"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.random() * 10 + 15 + "s",
            }}
          />
        ))}
      </div>

      {/* ── Main Content Container ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full">
        
        {/* Container for everything EXCEPT the names (fades out first) */}
        <div 
          className="flex flex-col items-center justify-center w-full"
          style={{
            opacity: Math.max(0, 1 - (progress - 0.85) * 6.66) // Fades out between 0.85 and 1.0
          }}
        >
          {/* Main Cinematic English Text */}
          <h2 
            className={cn(
              "font-cormorant italic text-4xl md:text-6xl lg:text-7xl text-rose-100/90 font-light tracking-[0.05em] leading-tight mb-8 drop-shadow-[0_0_25px_rgba(245,198,208,0.3)] animate-end-float",
              "transition-all duration-[2000ms] delay-[500ms]",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            And in every universe…
            <br />
            <span className="block mt-4 text-3xl md:text-5xl lg:text-6xl text-rose-200/80">I’d still choose you.</span>
          </h2>

          {/* Arabic Subtitle */}
          <p 
            className={cn(
              "font-ruqaa text-2xl md:text-3xl lg:text-4xl text-rose-300/70 tracking-wide",
              "transition-all duration-[2000ms] delay-[1500ms]",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
            dir="rtl"
          >
            وهفضل أختارك في كل مرة.
          </p>

          {/* Separator / Heart */}
          <div 
            className={cn(
              "my-16 md:my-24 relative flex items-center justify-center",
              "transition-all duration-[2000ms] delay-[2500ms]",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
          >
            <div className="absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
            <Heart className="w-5 h-5 md:w-6 md:h-6 text-rose-400/60 fill-rose-400/20 drop-shadow-[0_0_15px_rgba(245,198,208,0.4)] animate-end-pulse z-10" />
          </div>
        </div>

        {/* Final Reveal Names (Stays visible) */}
        <div 
          className={cn(
            "font-vibes text-4xl md:text-5xl lg:text-6xl text-rose-200 tracking-wider absolute bottom-12",
            "transition-all duration-[3000ms] delay-[3500ms]",
            "drop-shadow-[0_0_20px_rgba(245,198,208,0.4)]",
            isVisible ? "opacity-100" : "opacity-0 blur-sm"
          )}
        >
          Ziad <span className="font-cormorant italic text-rose-400/50 mx-2 text-3xl md:text-4xl">&times;</span> Rahma
        </div>
      </div>

      {/* ── Cinematic Vignette ── */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#080406_100%)] z-20" />
    </section>
  );
}
