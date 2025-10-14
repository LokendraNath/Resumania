import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = 4000;

app.use(cors());

// Connect DB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Api Working");
});

app.listen(PORT, () => console.log(`App Listen On http://localhost:${PORT}`));
