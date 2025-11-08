import express from "express";
import multer from "multer";
import { uploadImages, getUserImages } from "../controller/imageController";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.array("files", 10), uploadImages);

router.get("/user/:userId", getUserImages);

export default router;
