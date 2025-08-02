// backend/middleware/auth.js
import admin from "firebase-admin";

// ✅ Initialize once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), /// or use cert file for production
  });
}

export async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; /// ✅ Attach user info to request
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
