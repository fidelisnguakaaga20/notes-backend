// import dotenv from "dotenv";
// dotenv.config(); // /// Load .env first

// import express from "express";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// import notesRoutes from "./routes/notesRoutes.js";
// import { connectDB } from "./config/db.js";
// import { authenticateUser } from "./middleware/authMiddleware.js";
// import ratelimiter from "./middleware/rateLimiter.js";

// // /// Init Firebase Admin (ENV in prod, JSON only in dev)
// import "../utils/firebaseAdmin.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5001;

// // /// CORS
// const PROD_ORIGINS = [
//   process.env.FRONTEND_URL,            // e.g. https://notes-frontend.vercel.app
// ].filter(Boolean);

// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === "production"
//         ? PROD_ORIGINS
//         : ["http://localhost:5173"],
//     credentials: true,
//   })
// );

// app.use(express.json());

// // /// Health check (Render wake-up + monitoring)
// app.get("/api/health", (_req, res) => res.json({ ok: true }));

// // /// Protected API
// app.use("/api/notes", authenticateUser, ratelimiter, notesRoutes);

// // /// Serve frontend only if you build it into this repo (optional)
// if (process.env.NODE_ENV === "production" && process.env.SERVE_STATIC === "true") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (_req, res) =>
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//   );
// }

// // /// Start after DB connects
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log("Server started on PORT:", PORT);
//   });
// });



// backend/src/server.js
import dotenv from "dotenv";
dotenv.config(); // Load .env first

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import ratelimiter from "./middleware/rateLimiter.js";

// Initialize Firebase Admin (uses ENV in prod, local JSON in dev)
import "../utils/firebaseAdmin.js";

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

/* -----------------------------  CORS  ----------------------------- */
// In production: allow only your deployed frontend via env FRONTEND_URL
// In dev: allow Vite default origin
const PROD_ORIGINS = [process.env.FRONTEND_URL].filter(Boolean);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? PROD_ORIGINS
        : ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

/* --------------------------- Health routes ------------------------ */
app.get("/", (_req, res) =>
  res.send("Notes API is running. Try GET /api/health")
);
app.get("/api/health", (_req, res) => res.json({ ok: true }));

/* --------------------------- Protected API ------------------------ */
app.use("/api/notes", authenticateUser, ratelimiter, notesRoutes);

/* -------- Optional: serve built frontend when SERVE_STATIC=true ---- */
if (process.env.NODE_ENV === "production" && process.env.SERVE_STATIC === "true") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_req, res) =>
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  );
}

/* ----------------------------- Start ------------------------------ */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
