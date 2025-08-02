// backend/src/middleware/rateLimiter.js
import "dotenv/config";                       // ✅ ensure .env is loaded in this module
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let rateLimiter;

// If env vars are missing, don't block requests; just warn and pass through.
if (!url || !token) {
  console.warn("[RateLimiter] UPSTASH env vars missing; skipping rate limit in dev.");
  rateLimiter = (req, _res, next) => next();
} else {
  const redis = new Redis({ url, token });

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "10 s"),
    analytics: false,
  });

  rateLimiter = async (req, res, next) => {
    try {
      const key =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.headers["x-real-ip"] ||
        "global";

      const { success } = await limiter.limit(key);
      if (!success) return res.status(429).json({ message: "Too many requests" });

      next();
    } catch (err) {
      console.error("[RateLimiter] error:", err);
      // Don't fail the request because of ratelimiter issues
      next();
    }
  };
}

export default rateLimiter;
