import { motion, AnimatePresence } from "framer-motion";
import { Lock as LockIcon, Unlock as UnlockIcon } from "lucide-react";
import { DateInput } from "./DateInput";
import { cn } from "../../lib/utils";

interface LockProps {
  isUnlocked: boolean;
  onSuccess: () => void;
}

export function Lock({ isUnlocked, onSuccess }: LockProps) {
  return (
    <motion.div
      className={cn(
        "relative w-full max-w-sm mx-auto flex flex-col items-center mt-12 transition-[transform,opacity] duration-700",
        isUnlocked ? "scale-110" : ""
      )}
    >
      {/* 3D Premium Lock Container */}
      <motion.div
        animate={{
          y: isUnlocked ? -20 : [0, -5, 0],
        }}
        transition={{
          y: isUnlocked
            ? { duration: 0.5, ease: "easeOut" }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className={cn(
          "relative flex items-center justify-center rounded-3xl",
          "w-32 h-32 md:w-40 md:h-40",
          "bg-gradient-to-br from-white/10 to-transparent",
          "border border-white/20 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]",
          "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-rose-300/20 before:to-transparent before:opacity-50",
          "after:absolute after:inset-0 after:rounded-3xl after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
        )}
      >
        {/* Glow effect behind the lock icon */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-rose-500/20 blur-xl z-0"
          animate={{
            opacity: isUnlocked ? 0.8 : [0.3, 0.6, 0.3],
            scale: isUnlocked ? 1.5 : [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: isUnlocked ? 0 : Infinity }}
        />

        {/* Lock Icon */}
        <div className="relative z-10 text-rose-100 drop-shadow-[0_2px_10px_rgba(245,198,208,0.5)]">
          <AnimatePresence mode="wait">
            {!isUnlocked ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LockIcon size={64} strokeWidth={1.5} className="md:w-20 md:h-20" />
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <UnlockIcon size={64} strokeWidth={1.5} className="md:w-20 md:h-20 text-rose-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Inputs under the lock */}
      <motion.div
        animate={{ opacity: isUnlocked ? 0 : 1, y: isUnlocked ? 20 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mt-8 text-rose-200/60 font-playfair tracking-widest text-sm md:text-base uppercase">
          Enter Date to Unlock
        </p>
        <DateInput onSuccess={onSuccess} isUnlocked={isUnlocked} />
      </motion.div>
    </motion.div>
  );
}
