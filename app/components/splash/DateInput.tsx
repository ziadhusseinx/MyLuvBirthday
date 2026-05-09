import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

interface DateInputProps {
  onSuccess: () => void;
  isUnlocked: boolean;
}

export function DateInput({ onSuccess, isUnlocked }: DateInputProps) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isError, setIsError] = useState(false);

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const checkDate = (d: string, m: string, y: string) => {
    // Expected date: 10/05/2008 or 10/5/2008
    if (d === "10" && (m === "05" || m === "5") && y === "2008") {
      onSuccess();
    } else if (d.length === 2 && m.length >= 1 && y.length === 4) {
      // Wrong date entered fully
      setIsError(true);
      setTimeout(() => setIsError(false), 800);
      setDay("");
      setMonth("");
      setYear("");
      dayRef.current?.focus();
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUnlocked) return;
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setDay(val);
    setIsError(false);
    if (val.length === 2) {
      monthRef.current?.focus();
    }
    checkDate(val, month, year);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUnlocked) return;
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setMonth(val);
    setIsError(false);
    if (val.length === 2) {
      yearRef.current?.focus();
    } else if (val.length === 0) {
      // If empty and they press backspace, it naturally stays here or we could move back. 
      // Handled by keydown.
    }
    checkDate(day, val, year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUnlocked) return;
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setYear(val);
    setIsError(false);
    checkDate(day, month, val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, refToFocus: React.RefObject<HTMLInputElement | null>) => {
    if (isUnlocked) return;
    if (e.key === "Backspace" && e.currentTarget.value === "") {
      refToFocus.current?.focus();
    }
  };

  return (
    <motion.div
      animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex items-center gap-3 md:gap-4 justify-center mt-6 transition-colors duration-500",
        isError && "drop-shadow-[0_0_15px_rgba(255,0,0,0.4)]"
      )}
    >
      <input
        ref={dayRef}
        type="text"
        inputMode="numeric"
        placeholder="DD"
        value={day}
        onChange={handleDayChange}
        onKeyDown={(e) => handleKeyDown(e, null as any)} // No previous input to focus
        disabled={isUnlocked}
        className={cn(
          "w-14 h-16 md:w-16 md:h-20 text-center text-xl md:text-2xl font-playfair rounded-2xl",
          "bg-white/5 border border-white/10 backdrop-blur-md shadow-inner",
          "text-text-light placeholder:text-white/20 transition-[transform,opacity,border-color,box-shadow] duration-300",
          "focus:bg-white/10 focus:border-rose-300/50 focus:ring-1 focus:ring-rose-300/50",
          isError ? "border-red-500/50 bg-red-500/10 text-red-200" : "",
          isUnlocked && "opacity-0 pointer-events-none scale-90"
        )}
      />
      <span className={cn("text-2xl font-light text-rose-300/50", isUnlocked && "opacity-0")}>/</span>
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        placeholder="MM"
        value={month}
        onChange={handleMonthChange}
        onKeyDown={(e) => handleKeyDown(e, dayRef)}
        disabled={isUnlocked}
        className={cn(
          "w-14 h-16 md:w-16 md:h-20 text-center text-xl md:text-2xl font-playfair rounded-2xl",
          "bg-white/5 border border-white/10 backdrop-blur-md shadow-inner",
          "text-text-light placeholder:text-white/20 transition-[transform,opacity,border-color,box-shadow] duration-300",
          "focus:bg-white/10 focus:border-rose-300/50 focus:ring-1 focus:ring-rose-300/50",
          isError ? "border-red-500/50 bg-red-500/10 text-red-200" : "",
          isUnlocked && "opacity-0 pointer-events-none scale-90"
        )}
      />
      <span className={cn("text-2xl font-light text-rose-300/50", isUnlocked && "opacity-0")}>/</span>
      <input
        ref={yearRef}
        type="text"
        inputMode="numeric"
        placeholder="YYYY"
        value={year}
        onChange={handleYearChange}
        onKeyDown={(e) => handleKeyDown(e, monthRef)}
        disabled={isUnlocked}
        className={cn(
          "w-20 h-16 md:w-24 md:h-20 text-center text-xl md:text-2xl font-playfair rounded-2xl",
          "bg-white/5 border border-white/10 backdrop-blur-md shadow-inner",
          "text-text-light placeholder:text-white/20 transition-[transform,opacity,border-color,box-shadow] duration-300",
          "focus:bg-white/10 focus:border-rose-300/50 focus:ring-1 focus:ring-rose-300/50",
          isError ? "border-red-500/50 bg-red-500/10 text-red-200" : "",
          isUnlocked && "opacity-0 pointer-events-none scale-90"
        )}
      />
    </motion.div>
  );
}
