import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/noteController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import ratelimiter from "../middleware/rateLimiter.js";
// import { ratelimiter } from "../middleware/ratelimiter.js";

const router = express.Router();

// Apply authentication and rate limiting to all note routes
router.use(authenticateUser);
router.use(ratelimiter);

router.get("/", getAllNotes);
router.post("/", createNote);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
