import type { Route } from "./+types/home";
import { useState, useRef, useCallback } from "react";
import { SplashScreen } from "../components/splash/SplashScreen";
import { Background } from "../components/ui/Background";
import { InteractiveScene } from "../components/home/InteractiveScene";
import { CinematicVideo } from "../components/home/CinematicVideo";
import { FinalOverlay } from "../components/home/FinalOverlay";
import { CinematicLetter } from "../components/home/CinematicLetter";
import { RelationshipTimer } from "../components/home/RelationshipTimer";
import { VoiceNoteSection } from "../components/home/VoiceNoteSection";
import { MemoryGallery } from "../components/home/MemoryGallery";
import { FinalEnding } from "../components/home/FinalEnding";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Happy Birthday Rahma" },
    { name: "description", content: "A cinematic birthday experience for Rahma" },
  ];
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const scrollToScene = useCallback(() => {
    sceneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const scrollToVideo = useCallback(() => {
    videoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="w-full bg-bg-dark text-text-light font-cormorant">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <Background flow>
          {/* Section 1 — Interactive Scene (Character + Cake + Gift) */}
          <section
            ref={sceneRef}
            id="interactive-scene"
            className="relative w-full min-h-screen flex flex-col items-center justify-center"
          >
            <RelationshipTimer />
            <InteractiveScene />

            {/* Scroll hint at bottom of scene */}
            <button
              onClick={scrollToVideo}
              className="absolute bottom-8 left-0 right-0 mx-auto w-fit flex flex-col items-center gap-2 text-rose-200/40 hover:text-rose-200/70 transition-colors duration-500 cursor-pointer z-20 animate-gentle-bounce"
            >
              <span className="font-playfair text-xs tracking-[0.3em] uppercase">Scroll</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-60">
                <path d="M10 4L10 16M10 16L5 11M10 16L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </section>

          {/* Breathing room transition */}
          <div className="h-[10vh] w-full pointer-events-none" />

          {/* Section 2 — Scroll-Controlled Cinematic Video */}
          <div ref={videoRef}>
            <CinematicVideo
              onNavigateUp={scrollToScene}
            >
              <FinalOverlay />
            </CinematicVideo>
          </div>

          {/* Breathing room transition */}
          <div className="h-[15vh] w-full pointer-events-none" />

          {/* Section 3 — Cinematic Voice Note */}
          <VoiceNoteSection />

          {/* Breathing room transition */}
          <div className="h-[15vh] w-full pointer-events-none" />

          {/* Section 4 — Memory Gallery */}
          <MemoryGallery />

          {/* Breathing room transition */}
          <div className="h-[15vh] w-full pointer-events-none" />

          {/* Section 5 — Cinematic Love Letter */}
          <CinematicLetter />

          {/* Breathing room transition */}
          <div className="h-[20vh] w-full pointer-events-none" />

          {/* Final Section — Emotional Ending */}
          <FinalEnding />
        </Background>
      )}
    </main>
  );
}
