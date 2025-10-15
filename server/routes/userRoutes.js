import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouts = express.Router();

userRouts.post("/register", registerUser);
userRouts.post("/login", loginUser);

// Protected Router
userRouts.post("/profile", protect, getUserProfile);

export default userRouts;
