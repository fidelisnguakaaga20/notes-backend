// // backend/src/middleware/rateLimiter.js
// import "dotenv/config";                       // ✅ ensure .env is loaded in this module
// import { Redis } from "@upstash/redis";
// import { Ratelimit } from "@upstash/ratelimit";

// const url = process.env.UPSTASH_REDIS_REST_URL;
// const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// let rateLimiter;

// // If env vars are missing, don't block requests; just warn and pass through.
// if (!url || !token) {
//   console.warn("[RateLimiter] UPSTASH env vars missing; skipping rate limit in dev.");
//   rateLimiter = (req, _res, next) => next();
// } else {
//   const redis = new Redis({ url, token });

//   const limiter = new Ratelimit({
//     redis,
//     limiter: Ratelimit.fixedWindow(5, "10 s"),
//     analytics: false,
//   });

//   rateLimiter = async (req, res, next) => {
//     try {
//       const key =
//         req.ip ||
//         req.headers["x-forwarded-for"] ||
//         req.headers["x-real-ip"] ||
//         "global";

//       const { success } = await limiter.limit(key);
//       if (!success) return res.status(429).json({ message: "Too many requests" });

//       next();
//     } catch (err) {
//       console.error("[RateLimiter] error:", err);
//       // Don't fail the request because of ratelimiter issues
//       next();
//     }
//   };
// }

// export default rateLimiter;



// backend/src/middleware/rateLimiter.js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Enable only if both URL+TOKEN exist and not explicitly disabled
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const enabled =
  !!url && !!token && process.env.ENABLE_RATE_LIMIT !== "false";

let limiter = null;

if (enabled) {
  try {
    const redis = new Redis({ url, token });
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 req/min per ip
      analytics: false,
      prefix: "notesapp",
    });
    console.log("[RateLimiter] enabled");
  } catch (e) {
    console.warn("[RateLimiter] init failed, disabling:", e?.message || e);
    limiter = null;
  }
} else {
  console.log("[RateLimiter] disabled");
}

export default async function rateLimiter(req, res, next) {
  // If not configured, just pass through
  if (!limiter) return next();

  try {
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";

    const { success, limit, remaining, reset } = await limiter.limit(ip);
    res.setHeader("X-RateLimit-Limit", limit.toString());
    res.setHeader("X-RateLimit-Remaining", remaining.toString());
    res.setHeader("X-RateLimit-Reset", reset.toString());

    if (!success) return res.status(429).json({ message: "Too many requests" });
    next();
  } catch (err) {
    // Network/DNS errors: log once per request and do not break your app
    console.warn("[RateLimiter] error:", err);
    return next();
  }
}
