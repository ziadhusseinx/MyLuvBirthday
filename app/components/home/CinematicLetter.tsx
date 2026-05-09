import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * CinematicLetter — Scroll-reveal love letter.
 * 
 * UPDATED: Word-by-word reveal with "fly-away" effect.
 * Uses a single useScroll hook per line for performance.
 */

const MESSAGE_LINES = [
  "كل سنة وانتي أجمل حاجة حصلتلي.",
  "كل سنه ونحنا سوي مكملين ",
  "ومهما حصصل بنا من مشاكل و خلففات معزتك في قلبي زي مم هي بحبك ",
  "بحب تفاصيلك الصغيرة قبل الكبيرة.",
  "وسط كل الناس… قلبي اختارك انتي.",
  "معاكي حتى السكوت بيكون جميل.",
  "كل تفصيله هنا معموله  بحب و معموله ليكي",
  "وأيًا كان اللي هيحصل بعدين… انا هتجوزك ",
  "إنتي راحتي، وضحكتي، والحاجة الحلوة اللي بتحصل فجأة.",
  "ولو كان عندي أمنية واحدة تتكرر… هختارك انتي كل مرة.",
  "ربنا يخليكي ليا و ميحرمنيش منك ابدء ",
  "بحبك",
];

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  // Appearance: fade in + move up + scale
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [20, 0]);
  const scale = useTransform(progress, range, [0.8, 1]);
  
  // Exit: fade out when scroll goes past center (optional, but makes it feel "magical")
  // Actually, standard reveal is just appearing. The "fly away when going up" is naturally handled by useTransform.
  
  return (
    <motion.span
      style={{ opacity, y, scale, display: "inline-block" }}
      className="mx-1.5 md:mx-2 lg:mx-3"
    >
      {word}
    </motion.span>
  );
}

function MessageLine({ line }: { line: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const words = line.split(" ");

  // Track scroll for this specific line
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "center 35%"]
  });

  return (
    <div
      ref={ref}
      className="w-full my-40 md:my-56 lg:my-64 text-center font-ruqaa text-4xl md:text-5xl lg:text-6xl leading-[2] md:leading-[2.5] text-rose-50 flex flex-wrap justify-center"
      dir="rtl"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length) * 1.5; // Slight overlap for smoothness
        return (
          <Word 
            key={i} 
            word={word} 
            progress={scrollYProgress} 
            range={[Math.min(start, 0.9), Math.min(end, 1)]} 
          />
        );
      })}
    </div>
  );
}

export function CinematicLetter() {
  const titleRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: titleProgress } = useScroll({
    target: titleRef,
    offset: ["start 85%", "end 20%"]
  });

  const titleOpacity = useTransform(titleProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const titleY = useTransform(titleProgress, [0, 0.3, 0.7, 1], [30, 0, 0, -30]);

  return (
    <section className="relative w-full z-10 pt-32 pb-64 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8">

        {/* Elegant English Title */}
        <motion.div
          ref={titleRef}
          className="w-full text-center mb-64"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="font-cormorant italic text-4xl md:text-5xl lg:text-6xl text-rose-200/80 tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_20px_rgba(245,198,208,0.3)] font-light">
            A few words for you...
          </h2>
        </motion.div>

        {/* Dynamic Floating Arabic Lines */}
        <div className="flex flex-col items-center justify-center w-full">
          {MESSAGE_LINES.map((line, i) => (
            <MessageLine key={i} line={line} />
          ))}
        </div>

      </div>
    </section>
  );
}

