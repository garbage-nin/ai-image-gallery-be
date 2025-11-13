import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { createImage, getImagesByUser } from "../models/imageModel";

export async function uploadImages(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];
    const { user_id } = req.body;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing user_id" });
    }

    const results = [];

    for (const file of files) {
      const fileName = `${user_id}/${Date.now()}-${file.originalname}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue; // skip failed upload, but continue others
      }

      const { data: publicData } = supabase.storage
        .from("gallery-images")
        .getPublicUrl(fileName);

      const imageData = await createImage({
        user_id,
        filename: file.originalname,
        original_path: "",
        thumbnail_path: "",
      });

      results.push(imageData);
    }

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: results,
    });
  } catch (err: any) {
    console.error("Error uploading images:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

function generateTags(imageData: any) {}
export async function getUserImages(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });
    }

    const images = await getImagesByUser(userId);

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (err: any) {
    console.error("Error fetching images:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
