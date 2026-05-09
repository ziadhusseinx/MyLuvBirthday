import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Supabase Client (lazy + safe init) ──────────────────────
let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.warn("Supabase env vars missing – memory features disabled");
      return null;
    }
    supabase = createClient(url, key);
    return supabase;
  } catch (e) {
    console.warn("Supabase init failed:", e);
    return null;
  }
}

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
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
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
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not available");

  const { data, error } = await sb
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
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not available");

  const { error } = await sb.from("memories").delete().eq("id", id);

  if (error) {
    console.error("Supabase deleteMemory error:", error);
    throw error;
  }
}

// ─── IMAGE UPLOAD ────────────────────────────────────────────
// Uploads a base64 image to Supabase Storage and returns the public URL
export async function uploadImage(base64Data: string): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not available");

  // Convert base64 to Blob
  const res = await fetch(base64Data);
  const blob = await res.blob();

  // Generate unique filename
  const ext = blob.type.split("/")[1] || "jpg";
  const fileName = `memory_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Upload to Supabase Storage
  const { error } = await sb.storage
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
  } = sb.storage.from("memory-images").getPublicUrl(fileName);

  return publicUrl;
}
