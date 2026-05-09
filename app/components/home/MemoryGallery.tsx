import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

import { AuthModal } from "./AuthModal";
import { MemoryEditor } from "./MemoryEditor";
import { MemoryManager } from "./MemoryManager";
import { fetchMemories, addMemory, type Memory } from "./memoryService";

// Check if already authenticated (persisted in localStorage by AuthModal)
function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isZiadAuthenticated") === "true";
}

type PendingAction = "add" | "manage" | null;

export function MemoryGallery() {
  const [activeTab, setActiveTab] = useState<"photos" | "text">("photos");
  const [activeIndex, setActiveIndex] = useState(0);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // Load memories on mount
  useEffect(() => {
    fetchMemories().then((data) => {
      setMemories(data);
      setIsLoading(false);
    });
  }, []);

  // Filter memories based on active tab (no more "mixed")
  const filteredMemories = useMemo(() => {
    if (activeTab === "photos") return memories.filter((m) => m.type === "photo");
    return memories.filter((m) => m.type === "text");
  }, [activeTab, memories]);

  // Reset index when tab changes or memories update
  useEffect(() => {
    setActiveIndex(0);
  }, [activeTab]);

  // Clamp active index when filteredMemories shrinks (e.g. after delete)
  useEffect(() => {
    if (filteredMemories.length > 0 && activeIndex >= filteredMemories.length) {
      setActiveIndex(Math.max(0, filteredMemories.length - 1));
    }
  }, [filteredMemories.length, activeIndex]);

  const next = () => setActiveIndex((i) => Math.min(filteredMemories.length - 1, i + 1));
  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));

  // Protected action handler — checks auth before proceeding
  const handleProtectedAction = (action: PendingAction) => {
    if (isAuthenticated()) {
      // Already authenticated, open directly
      if (action === "add") setIsEditorOpen(true);
      if (action === "manage") setIsManagerOpen(true);
    } else {
      // Need auth first, remember what to open after
      setPendingAction(action);
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    // Open the action that was pending
    if (pendingAction === "add") setIsEditorOpen(true);
    if (pendingAction === "manage") setIsManagerOpen(true);
    setPendingAction(null);
  };

  // Responsive card sizing — debounced resize handler
  const [cardWidth, setCardWidth] = useState(320);
  const [cardHeight, setCardHeight] = useState(440);
  const [cardOffset, setCardOffset] = useState(360);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver for section reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.innerWidth < 768) {
          setCardWidth(260);
          setCardHeight(360);
          setCardOffset(280);
        } else {
          setCardWidth(320);
          setCardHeight(440);
          setCardOffset(360);
        }
      }, 150);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => { window.removeEventListener("resize", handleResize); clearTimeout(timeout); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden z-20"
    >

      {/* ── Section Title ── */}
      <div className={cn(
        "text-center mb-8 md:mb-12 transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      )}>
        <h3 className="font-cormorant italic text-3xl md:text-5xl text-rose-200/80 tracking-[0.2em] font-light drop-shadow-[0_0_15px_rgba(245,198,208,0.2)]">
          Memories
        </h3>
        <p className="mt-3 font-cormorant text-rose-300/40 uppercase tracking-[0.3em] text-xs">
          Choose a Moment
        </p>
      </div>

      {/* ── Controls Bar: Action Buttons + Category Tabs ── */}
      <div className={cn(
        "flex flex-col items-center gap-5 w-full max-w-2xl px-4 mb-12 md:mb-16 z-20 transition-all duration-1000 delay-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}>
        {/* Row 1: Action Buttons — always horizontal */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Add Memory */}
          <button
            onClick={() => handleProtectedAction("add")}
            className={cn(
              "px-5 md:px-6 py-2 md:py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-500 flex items-center gap-2",
              "bg-gradient-to-r from-rose-900/40 to-[#18060e] text-rose-200 border border-rose-600/40",
              "shadow-[0_0_15px_rgba(245,198,208,0.15)] hover:scale-105 hover:shadow-[0_0_25px_rgba(245,198,208,0.3)] hover:border-rose-400/60"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add Memory
          </button>

          {/* Manage Memories */}
          <button
            onClick={() => handleProtectedAction("manage")}
            className={cn(
              "px-5 md:px-6 py-2 md:py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-500 flex items-center gap-2",
              "bg-transparent text-rose-300/50 border border-rose-900/30",
              "hover:text-rose-200 hover:border-rose-500/40 hover:bg-rose-900/10"
            )}
          >
            <Settings className="w-3.5 h-3.5" />
            Manage
          </button>
        </div>

        {/* Row 2: Category Tabs */}
        <div className="flex items-center justify-center gap-2 md:gap-3">
          {(["Photos", "Text"] as const).map((tab) => {
            const tabKey = tab.toLowerCase() as "photos" | "text";
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabKey)}
                className={cn(
                  "px-5 md:px-8 py-2 md:py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-500",
                  isActive
                    ? "bg-[#2a0e18]/80 text-rose-100 border border-rose-500/30 shadow-[0_0_20px_rgba(245,198,208,0.15)]"
                    : "bg-transparent text-rose-300/40 border border-transparent hover:text-rose-200/70"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Card Slider Area ── */}
      <div className="relative w-full h-[380px] md:h-[480px] flex justify-center items-center">

        {/* Touch Swipe Surface */}
        <SwipeSurface onSwipeLeft={next} onSwipeRight={prev} />

        {/* Cards — CSS transitions only */}
        {filteredMemories.map((memory, i) => {
          const offsetIndex = i - activeIndex;
          if (Math.abs(offsetIndex) > 3) return null;

          const isActive = offsetIndex === 0;
          const xPos = offsetIndex * cardOffset;
          const cardScale = isActive ? 1 : 0.85;
          const cardOpacity = isActive ? 1 : Math.abs(offsetIndex) === 1 ? 0.4 : 0.1;

          return (
            <div
              key={memory.id}
              className="absolute left-1/2 top-1/2 origin-center pointer-events-none transition-all duration-500 ease-out will-change-transform"
              style={{
                transform: `translate(-50%, -50%) translateX(${xPos}px) scale(${cardScale})`,
                opacity: cardOpacity,
                zIndex: 20 - Math.abs(offsetIndex),
                width: cardWidth,
                height: cardHeight,
              }}
            >
              <div className={cn(
                "w-full h-full rounded-[2rem] overflow-hidden",
                memory.type === "photo"
                  ? "p-2 bg-gradient-to-br from-[#2a0e18]/80 to-[#1a0810]/90 border border-rose-900/40"
                  : "p-6 md:p-8 bg-gradient-to-br from-[#1a0810]/95 to-[#080406]/95 border border-rose-800/30 flex flex-col items-center justify-center text-center",
                isActive ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "shadow-none"
              )}>
                {memory.type === "photo" ? (
                  <div className="w-full h-full relative rounded-[1.5rem] overflow-hidden bg-rose-950/20 flex flex-col items-center justify-center">
                    {memory.content ? (
                      <img
                        src={memory.content}
                        alt={memory.caption}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="flex flex-col items-center justify-center text-rose-400/30 gap-4 h-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                              <span class="font-cormorant italic text-sm text-center px-4">Image not found</span>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-rose-400/30 gap-4">
                        <ImageIcon className="w-8 h-8" />
                        <span className="font-cormorant italic text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="font-ruqaa text-2xl md:text-3xl leading-relaxed text-rose-100/90" dir="rtl">
                    "{memory.content}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Navigation & Caption ── */}
      <div className="mt-10 md:mt-12 flex flex-col items-center z-40 w-full max-w-lg px-4">
        {/* Nav Row: Arrows + Dots */}
        <div className="flex items-center justify-center gap-6 md:gap-8 mb-5">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-rose-900/30 flex items-center justify-center text-rose-300/60 hover:text-rose-200 hover:border-rose-500/40 hover:bg-rose-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Pagination dots — capped max width so they don't overflow */}
          <div className="flex items-center gap-1.5 max-w-[200px] overflow-hidden flex-wrap justify-center">
            {filteredMemories.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500 flex-shrink-0",
                  i === activeIndex ? "w-5 bg-rose-300/80 shadow-[0_0_8px_rgba(245,198,208,0.5)]" : "w-1.5 bg-rose-900/40"
                )}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={activeIndex === filteredMemories.length - 1}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-rose-900/30 flex items-center justify-center text-rose-300/60 hover:text-rose-200 hover:border-rose-500/40 hover:bg-rose-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Active Caption */}
        {!isLoading && filteredMemories.length > 0 ? (
          <div className="h-10 flex items-center justify-center transition-opacity duration-500">
            <p className="font-ruqaa text-xl md:text-2xl text-rose-200/80 tracking-wide text-center" dir="rtl">
              {filteredMemories[activeIndex]?.caption}
            </p>
          </div>
        ) : !isLoading && filteredMemories.length === 0 ? (
          <div className="h-10 flex items-center justify-center">
            <p className="font-cormorant italic text-rose-400/40 text-lg">No memories found. Add your first moment.</p>
          </div>
        ) : null}
      </div>

      {/* ═══ MODALS ═══ */}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => { setIsAuthOpen(false); setPendingAction(null); }}
        onSuccess={handleAuthSuccess}
      />

      <MemoryEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={async (newMemory) => {
          const added = await addMemory(newMemory as any);
          setMemories((prev) => [added, ...prev]);
          setActiveIndex(0);
        }}
      />

      <MemoryManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        memories={memories}
        onMemoryDeleted={(id) => {
          setMemories((prev) => prev.filter((m) => m.id !== id));
        }}
      />

    </section>
  );
}

/** Lightweight swipe surface — replaces Framer Motion drag */
function SwipeSurface({ onSwipeLeft, onSwipeRight }: { onSwipeLeft: () => void; onSwipeRight: () => void }) {
  const startX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const delta = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) onSwipeLeft();
      else onSwipeRight();
    }
  }, [onSwipeLeft, onSwipeRight]);
  return (
    <div
      className="absolute inset-0 z-30 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
}
