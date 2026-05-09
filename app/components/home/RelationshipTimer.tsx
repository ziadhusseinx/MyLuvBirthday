import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function RelationshipTimer() {
  // Start date: 3 years and 14 days ago from May 8, 2026
  // May 8, 2026 - 3 years = May 8, 2023
  // May 8, 2023 - 14 days = April 24, 2023
  const startDate = useMemo(() => new Date("2023-04-24T00:00:00"), []);
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = now.getTime() - startDate.getTime();

      if (difference > 0) {
        const seconds = Math.floor((difference / 1000) % 60);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const daysTotal = Math.floor(difference / (1000 * 60 * 60 * 24));
        
        // Simple year calculation (approximation is fine for cinematic feel, but let's be accurate)
        const years = Math.floor(daysTotal / 365);
        const days = daysTotal % 365;

        setTimeLeft({ years, days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none"
    >
      {/* Container with soft glow */}
      <div className="relative flex items-center gap-4 md:gap-8 px-6 py-3 rounded-full bg-[#1a0810]/30 backdrop-blur-md border border-rose-900/20 shadow-[0_0_20px_rgba(244,198,208,0.05)]">
        
        <TimeUnit value={timeLeft.years} label="Years" />
        <Separator />
        <TimeUnit value={timeLeft.days} label="Days" />
        <Separator />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="Secs" />

      </div>

      {/* Subtitle */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="mt-3 font-cormorant italic text-xs md:text-sm tracking-[0.2em] text-rose-200/80 drop-shadow-[0_0_8px_rgba(245,198,208,0.3)]"
      >
        The time we’ve shared together
      </motion.div>
    </motion.div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[3rem] md:min-w-[4rem]">
      <div className="relative h-6 md:h-8 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="block font-playfair text-lg md:text-2xl text-rose-100 drop-shadow-[0_0_10px_rgba(245,198,208,0.4)]"
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-cormorant text-[10px] md:text-xs uppercase tracking-widest text-rose-400/60 mt-1">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="w-[1px] h-4 bg-rose-900/30 self-center mt-[-10px]" />
  );
}
