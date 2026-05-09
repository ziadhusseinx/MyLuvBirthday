import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import { cn } from "../../lib/utils";
import { uploadImage, type Memory } from "./memoryService";

interface MemoryEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Partial<Memory>) => void;
}

export function MemoryEditor({ isOpen, onClose, onSave }: MemoryEditorProps) {
  const [type, setType] = useState<"text" | "photo">("text");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!caption.trim() && type === "text") return;
    if (!imageUrl.trim() && type === "photo") return;

    setIsSaving(true);

    try {
      let finalImageUrl = imageUrl;

      // If photo memory, upload the base64 image to Supabase Storage first
      if (type === "photo" && imageUrl.startsWith("data:")) {
        finalImageUrl = await uploadImage(imageUrl);
      }

      onSave({
        type,
        content: type === "photo" ? finalImageUrl : caption,
        caption: type === "photo" ? caption : content || "ذكرى سعيدة",
      });

      // Reset
      setContent("");
      setCaption("");
      setImageUrl("");
    } catch (err) {
      console.error("Failed to save memory:", err);
    } finally {
      setIsSaving(false);
      onClose();
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080406]/90 backdrop-blur-xl px-4 py-8 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "relative w-full max-w-2xl p-8 md:p-12 rounded-[2.5rem] flex flex-col my-auto",
              "bg-gradient-to-br from-[#1a0810]/95 to-[#080406]/95 backdrop-blur-2xl",
              "border border-rose-900/30 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_0_30px_rgba(245,198,208,0.03)]"
            )}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              disabled={isSaving}
              className="absolute top-6 right-6 text-rose-200/40 hover:text-rose-200 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-cormorant italic text-3xl md:text-4xl text-rose-200/90 tracking-widest mb-2 text-center">
              Add a Memory
            </h3>
            <p className="font-cormorant text-sm text-rose-300/40 mb-10 text-center uppercase tracking-[0.2em]">
              Preserve a beautiful moment forever
            </p>

            {/* Type Selector */}
            <div className="flex items-center justify-center gap-4 mb-10">
              {(["photo", "text"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "px-6 py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-sm transition-all duration-500",
                    type === t
                      ? "bg-[#2a0e18]/80 text-rose-100 border border-rose-500/40 shadow-[0_0_20px_rgba(245,198,208,0.15)]"
                      : "bg-transparent text-rose-300/40 border border-rose-900/20 hover:text-rose-200/70"
                  )}
                >
                  {t === "text" ? "Text Memory" : "Photo Memory"}
                </button>
              ))}
            </div>

            {/* Editor Area */}
            <div className="flex flex-col gap-6 w-full">
              
              {type === "photo" && (
                <div className="flex flex-col gap-2">
                  <label className="font-cormorant text-rose-300/60 uppercase tracking-widest text-xs ml-2">Upload Photo</label>
                  <div className="relative w-full rounded-2xl bg-[#0a0507] border border-rose-900/30 overflow-hidden group hover:border-rose-500/40 transition-colors flex items-center justify-center border-dashed">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImageUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full py-8 flex flex-col items-center justify-center gap-3 text-rose-900/40 group-hover:text-rose-400/60 transition-colors pointer-events-none">
                      <Upload className="w-8 h-8" />
                      <span className="font-cormorant italic tracking-widest text-sm">Click to select an image</span>
                    </div>
                  </div>
                  {/* Image Preview */}
                  <AnimatePresence>
                    {imageUrl && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="w-full mt-4 rounded-2xl overflow-hidden border border-rose-900/20 max-h-[300px] flex justify-center bg-[#050203]"
                      >
                        <img src={imageUrl} alt="Preview" className="object-contain max-h-[300px]" onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}/>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-cormorant text-rose-300/60 uppercase tracking-widest text-xs ml-2 text-right">
                  {type === "text" ? "Memory Text" : "Arabic Caption (Optional)"}
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={type === "text" ? "اكتب ذكرياتك هنا..." : "وصف للصورة..."}
                  dir="rtl"
                  rows={type === "text" ? 6 : 3}
                  className="w-full rounded-2xl bg-[#0a0507] border border-rose-900/30 px-5 py-4 text-rose-100 font-ruqaa text-2xl md:text-3xl leading-relaxed placeholder:text-rose-900/40 focus:outline-none focus:border-rose-500/40 transition-colors resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
                />
              </div>

              {type === "text" && (
                <div className="flex flex-col gap-2">
                  <label className="font-cormorant text-rose-300/60 uppercase tracking-widest text-xs ml-2 text-right">Title / Date (Optional)</label>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="عنوان أو تاريخ الذكرى..."
                    dir="rtl"
                    className="w-full rounded-2xl bg-[#0a0507] border border-rose-900/30 px-5 py-4 text-rose-100 font-ruqaa text-xl placeholder:text-rose-900/40 focus:outline-none focus:border-rose-500/40 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 mt-10">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-sm text-rose-300/60 hover:text-rose-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || (type === "text" ? !caption.trim() : !imageUrl.trim())}
                className={cn(
                  "px-8 py-2.5 rounded-full font-cormorant uppercase tracking-[0.2em] text-sm transition-all duration-500 flex items-center gap-2",
                  "bg-rose-900/40 text-rose-100 border border-rose-500/40",
                  "hover:bg-rose-900/60 hover:border-rose-400/60 hover:shadow-[0_0_25px_rgba(245,198,208,0.25)]",
                  "disabled:opacity-40 disabled:hover:shadow-none disabled:cursor-not-allowed"
                )}
              >
                {isSaving ? "Saving..." : "Save Memory"}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
