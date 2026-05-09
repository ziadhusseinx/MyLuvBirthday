import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, Image as ImageIcon, FileText } from "lucide-react";
import { cn } from "../../lib/utils";
import { deleteMemory, type Memory } from "./memoryService";

interface MemoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  onMemoryDeleted: (id: string) => void;
}

export function MemoryManager({ isOpen, onClose, memories, onMemoryDeleted }: MemoryManagerProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteMemory(id);
    onMemoryDeleted(id);
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080406]/90 backdrop-blur-xl px-4 py-8"
        >
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-[2.5rem]",
              "bg-gradient-to-br from-[#1a0810]/95 to-[#080406]/95 backdrop-blur-2xl",
              "border border-rose-900/30 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_0_30px_rgba(245,198,208,0.03)]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 pb-4 flex-shrink-0">
              <div>
                <h3 className="font-cormorant italic text-2xl md:text-3xl text-rose-200/90 tracking-widest">
                  Manage Memories
                </h3>
                <p className="font-cormorant text-xs text-rose-300/40 uppercase tracking-[0.2em] mt-1">
                  {memories.length} {memories.length === 1 ? "memory" : "memories"} saved
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-rose-200/40 hover:text-rose-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
              {memories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-rose-400/30">
                  <FileText className="w-12 h-12 mb-4" />
                  <p className="font-cormorant italic text-lg">No memories yet.</p>
                  <p className="font-cormorant text-sm mt-1">Add your first moment to see it here.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {memories.map((memory) => (
                      <motion.div
                        key={memory.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className={cn(
                          "relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                          "bg-[#0d0509]/60 border border-rose-900/20 hover:border-rose-800/40",
                          confirmDeleteId === memory.id && "border-red-900/40 bg-red-950/20",
                          deletingId === memory.id && "opacity-50 pointer-events-none"
                        )}
                      >
                        {/* Preview Thumbnail */}
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#080406] border border-rose-900/20 flex items-center justify-center">
                          {memory.type === "photo" && memory.content ? (
                            <img
                              src={memory.content}
                              alt={memory.caption}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center text-rose-400/30">
                              {memory.type === "photo" ? (
                                <ImageIcon className="w-6 h-6" />
                              ) : (
                                <FileText className="w-6 h-6" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-cormorant uppercase tracking-widest",
                              memory.type === "photo"
                                ? "bg-rose-900/30 text-rose-300/70"
                                : "bg-[#1a0810] text-rose-300/60"
                            )}>
                              {memory.type}
                            </span>
                          </div>
                          <p className="font-ruqaa text-sm md:text-base text-rose-100/80 truncate" dir="rtl">
                            {memory.type === "text" ? memory.content : memory.caption || "No caption"}
                          </p>
                          <p className="font-cormorant text-xs text-rose-400/30 mt-1">
                            {new Date(memory.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        {/* Delete Area */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                          {confirmDeleteId === memory.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1.5 rounded-full font-cormorant text-xs text-rose-300/60 hover:text-rose-200 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDelete(memory.id)}
                                disabled={deletingId === memory.id}
                                className="px-4 py-1.5 rounded-full font-cormorant text-xs bg-red-900/40 text-red-200 border border-red-700/40 hover:bg-red-900/60 hover:border-red-600/60 transition-all duration-300 shadow-[0_0_10px_rgba(200,50,70,0.15)]"
                              >
                                {deletingId === memory.id ? "..." : "Delete"}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(memory.id)}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-rose-400/30 hover:text-red-400/80 hover:bg-red-900/20 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
