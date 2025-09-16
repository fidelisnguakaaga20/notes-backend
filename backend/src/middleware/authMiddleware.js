// import admin from "../../utils/firebaseAdmin.js";

// export const authenticateUser = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized: Missing token" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     req.user = decoded;
//     req.uid = decoded.uid;
//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };


import admin from "../../utils/firebaseAdmin.js";

export const authenticateUser = async (req, res, next) => {
  // Let CORS preflight through without auth
  if (req.method === "OPTIONS") return res.sendStatus(204);

  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    req.uid = decoded.uid;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
