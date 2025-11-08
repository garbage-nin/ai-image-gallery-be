import { supabase } from "../lib/supabase";

export interface Image {
  id?: number;
  user_id: string;
  filename: string;
  original_path: string;
  thumbnail_path: string;
  uploaded_at?: string;
}

export async function createImage(image: Image) {
  const { data, error } = await supabase
    .from("images")
    .insert(image)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getImagesByUser(userId: string) {
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", userId)
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  return data;
}
