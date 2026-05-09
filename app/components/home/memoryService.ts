import { createClient } from "@supabase/supabase-js";

// ─── Supabase Client ─────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types ───────────────────────────────────────────────────
export type Memory = {
  id: string;
  type: "photo" | "text";
  content: string;
  caption: string;
  createdAt: number;
};

// Map Supabase row → frontend Memory
function toMemory(row: any): Memory {
  return {
    id: row.id,
    type: row.type,
    content: row.content,
    caption: row.caption || "",
    createdAt: new Date(row.created_at).getTime(),
  };
}

// ─── FETCH ALL ───────────────────────────────────────────────
export async function fetchMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetchMemories error:", error);
    return [];
  }

  return (data || []).map(toMemory);
}

// ─── ADD MEMORY ──────────────────────────────────────────────
export async function addMemory(
  memory: Omit<Memory, "id" | "createdAt">
): Promise<Memory> {
  const { data, error } = await supabase
    .from("memories")
    .insert([
      {
        type: memory.type,
        content: memory.content,
        caption: memory.caption,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase addMemory error:", error);
    throw error;
  }

  return toMemory(data);
}

// ─── DELETE MEMORY ───────────────────────────────────────────
export async function deleteMemory(id: string): Promise<void> {
  const { error } = await supabase.from("memories").delete().eq("id", id);

  if (error) {
    console.error("Supabase deleteMemory error:", error);
    throw error;
  }
}

// ─── IMAGE UPLOAD ────────────────────────────────────────────
// Uploads a base64 image to Supabase Storage and returns the public URL
export async function uploadImage(base64Data: string): Promise<string> {
  // Convert base64 to Blob
  const res = await fetch(base64Data);
  const blob = await res.blob();

  // Generate unique filename
  const ext = blob.type.split("/")[1] || "jpg";
  const fileName = `memory_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from("memory-images")
    .upload(fileName, blob, {
      contentType: blob.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase uploadImage error:", error);
    throw error;
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("memory-images").getPublicUrl(fileName);

  return publicUrl;
}
