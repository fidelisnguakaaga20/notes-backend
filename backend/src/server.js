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

// Init Firebase Admin (ENV in prod, JSON only in dev)
import "../utils/firebaseAdmin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

const PROD_ORIGINS = [
  process.env.FRONTEND_URL, // e.g. https://notes-backend-eta-one.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? PROD_ORIGINS
        : ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // cache preflight for a day
  })
);

// make sure OPTIONS preflight always succeeds
app.options("*", cors());

app.use(express.json());

// health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// protected API
app.use("/api/notes", authenticateUser, ratelimiter, notesRoutes);

// (optional) serve static if you ever set SERVE_STATIC=true and build into /frontend/dist
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
