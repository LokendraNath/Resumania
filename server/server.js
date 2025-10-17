import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouts from "./routes/userRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
import resumeRouts from "./routes/resumeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 4000;

// Connect DB
connectDB();

// Middleware
app.use("/api/auth", userRouts);
app.use("/api/resume", resumeRouts);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, _path) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173/");
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Api Working");
});

app.listen(PORT, () => console.log(`App Listen On http://localhost:${PORT}`));
