// backend/src/server.js

import dotenv from "dotenv";
dotenv.config(); // ✅ Load env variables first

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
// import ratelimiter from "./middleware/ratelimiter.js";
import { authenticateUser } from "./middleware/authMiddleware.js"; /// ✅ Auth middleware
import ratelimiter from "./middleware/rateLimiter.js";

/// ✅ Required to resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

/// ✅ DEBUG: Check if .env is being loaded
console.log("Redis URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("Redis TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN);
console.log("Mongo URI:", process.env.MONGO_URI);

/// ✅ Enable CORS in development only
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use(express.json()); // ✅ Parse JSON body

/// ✅ Apply auth + rate limiter + route
app.use("/api/notes", authenticateUser, ratelimiter, notesRoutes);

/// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

/// ✅ Start after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
