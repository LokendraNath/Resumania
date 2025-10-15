import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouts from "./routes/userRoutes.js";

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

// Routes
app.get("/", (req, res) => {
  res.send("Api Working");
});

app.listen(PORT, () => console.log(`App Listen On http://localhost:${PORT}`));
