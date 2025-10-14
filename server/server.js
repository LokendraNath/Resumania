import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 4000;

app.use(cors());

// Connect DB

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Api Working");
});

app.listen(PORT, () => console.log(`App Listen On http://localhost:${PORT}`));
