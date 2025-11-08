import { supabase } from "../lib/supabase";

export interface ImageMetadata {
  id?: number;
  image_id: number;
  user_id: string;
  description?: string;
  tags?: string[];
  colors?: string[];
  ai_processing_status?: string;
  created_at?: string;
}

export async function createImageMetadata(metadata: ImageMetadata) {
  const { data, error } = await supabase
    .from("image_metadata")
    .insert(metadata)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMetadataByImage(imageId: number) {
  const { data, error } = await supabase
    .from("image_metadata")
    .select("*")
    .eq("image_id", imageId)
    .single();

  if (error) throw error;
  return data;
}
