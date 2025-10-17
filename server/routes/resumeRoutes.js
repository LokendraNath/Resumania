import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createResume,
  deleteResume,
  getResumeById,
  getUserResumes,
  updatedResume,
} from "../controllers/resumeControllers.js";
import { uploadResumeImage } from "../controllers/uploadImages.js";

const resumeRouts = express.Router();

resumeRouts.post("/", protect, createResume);
resumeRouts.get("/", protect, getUserResumes);
resumeRouts.get("/:id", protect, getResumeById);

resumeRouts.put("/:id", protect, updatedResume);
resumeRouts.put("/:id/upload-images", protect, uploadResumeImage);

resumeRouts.delete("/:id", protect, deleteResume);

export default resumeRouts;
