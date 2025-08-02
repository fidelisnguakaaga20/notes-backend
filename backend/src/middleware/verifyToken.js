// backend/middleware/verifyToken.js
import admin from "../../utils/firebaseAdmin.js";

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader); /// ✅ Logs token (or undefined)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    req.uid = decodedToken.uid; /// ✅ Attach UID to req
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
