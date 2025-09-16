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


import dotenv from "dotenv";
dotenv.config(); // load .env first

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import ratelimiter from "./middleware/rateLimiter.js";

import "../utils/firebaseAdmin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Allowed origins (prod + local)
const allowList = [
  process.env.FRONTEND_URL,           // e.g. https://notes-backend-eta-one.vercel.app
  "http://localhost:5173"
].filter(Boolean);

// CORS that always handles preflight
const corsOptions = {
  origin(origin, cb) {
    // allow same-origin or tools (no origin), and any in allowList
    if (!origin || allowList.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: false // not using cookies
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight for all routes

app.use(express.json());

// Simple health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Protected API
app.use("/api/notes", authenticateUser, ratelimiter, notesRoutes);

// (Optional) serve static build if you ever bundle frontend here
if (process.env.NODE_ENV === "production" && process.env.SERVE_STATIC === "true") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_req, res) =>
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  );
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
