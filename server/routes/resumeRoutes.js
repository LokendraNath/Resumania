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

const resumeRouter = express.Router();

resumeRouter.post("/", protect, createResume);
resumeRouter.get("/", protect, getUserResumes);
resumeRouter.get("/:id", protect, getResumeById);

resumeRouter.put("/:id", protect, updatedResume);
resumeRouter.put("/:id/upload-images", protect, uploadResumeImage);

resumeRouter.delete("/:id", protect, deleteResume);

export default resumeRouter;
