import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { cn } from "../../lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError(false);
      setIsUnlocking(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize input by removing spaces
    const normalizedInput = password.replace(/\s+/g, '');
    
    // Accept "roo" case-insensitive
    const isCorrect = normalizedInput.toLowerCase() === "roo";

    if (isCorrect) {
      setError(false);
      setIsUnlocking(true);
      // Persist auth session
      localStorage.setItem("isZiadAuthenticated", "true");
      setTimeout(() => {
        onSuccess();
      }, 1500); // Wait for unlock animation
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080406]/80 backdrop-blur-xl px-4"
        >
          {/* Background Glow */}
          <div className={cn(
            "absolute inset-0 pointer-events-none transition-colors duration-500",
            error ? "bg-[radial-gradient(circle_at_center,rgba(200,50,70,0.15)_0%,transparent_60%)]" : "bg-[radial-gradient(circle_at_center,rgba(245,198,208,0.05)_0%,transparent_60%)]"
          )} />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={
              error 
                ? { x: [-10, 10, -10, 10, 0], scale: 1, y: 0 } 
                : { scale: 1, y: 0 }
            }
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={error ? { duration: 0.4 } : { type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "relative w-full max-w-sm p-8 rounded-[2.5rem] flex flex-col items-center",
              "bg-gradient-to-br from-[#1a0810]/90 to-[#080406]/95 backdrop-blur-2xl",
              "border shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors duration-500",
              error ? "border-red-900/50 shadow-[0_0_30px_rgba(200,50,70,0.2)]" : "border-rose-900/30 shadow-[inset_0_0_20px_rgba(245,198,208,0.05)]"
            )}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-rose-200/40 hover:text-rose-200 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            {/* Lock Icon */}
            <motion.div 
              animate={{ rotate: error ? [-10, 10, -10, 10, 0] : 0 }}
              transition={{ duration: 0.4 }}
              className="w-20 h-20 mb-6 rounded-full bg-[#2a0e18]/50 flex items-center justify-center border border-rose-800/30 shadow-[0_0_30px_rgba(245,198,208,0.1)] relative"
            >
              <AnimatePresence mode="wait">
                {isUnlocking ? (
                  <motion.div
                    key="unlock"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-rose-300"
                  >
                    <Unlock className="w-8 h-8" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="lock"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={cn(
                      "transition-colors duration-300",
                      error ? "text-red-400" : "text-rose-300/80"
                    )}
                  >
                    <Lock className="w-8 h-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <h3 className="font-cormorant italic text-2xl text-rose-200/90 tracking-widest mb-2">Private Access</h3>
            <p className="font-cormorant text-sm text-rose-300/50 mb-8 uppercase tracking-[0.2em]">Enter the secret word</p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
              <div className="relative w-full max-w-[240px]">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the secret word"
                  className={cn(
                    "w-full bg-transparent border-b-2 py-3 text-center text-xl md:text-2xl font-playfair tracking-widest text-rose-100 placeholder:text-rose-900/30 focus:outline-none transition-colors duration-300",
                    error ? "border-red-900/60 text-red-100" : "border-rose-900/40 focus:border-rose-500/60"
                  )}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isUnlocking}
                className={cn(
                  "mt-2 px-8 py-3 rounded-full font-cormorant uppercase tracking-[0.2em] text-sm transition-all duration-500",
                  "bg-rose-900/20 text-rose-200 border border-rose-500/20",
                  "hover:bg-rose-900/40 hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(245,198,208,0.2)]",
                  isUnlocking && "opacity-0 scale-95"
                )}
              >
                Unlock
              </button>
            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
