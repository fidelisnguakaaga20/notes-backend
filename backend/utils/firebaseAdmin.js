// import admin from "firebase-admin";
// import { readFileSync } from "fs";
// import { dirname, join } from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // ✅ Load service account
// const serviceAccount = JSON.parse(
//   readFileSync(join(__dirname, "../firebase-service-account.json"))
// );

// // ✅ Initialize only once
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// export default admin;



// backend/utils/firebaseAdmin.js
// /// Safe hybrid: ENV in production (Render), local JSON only for dev.

import admin from "firebase-admin";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// /// Prefer ENV (Render)
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Render stores multiline envs as "\n" → convert back:
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// /// Fallback to local JSON ONLY in non-production (dev)
const useJsonFallback =
  (!projectId || !clientEmail || !privateKey) &&
  process.env.NODE_ENV !== "production";

let credentialConfig = null;

if (projectId && clientEmail && privateKey) {
  credentialConfig = { projectId, clientEmail, privateKey }; // /// ENV path
} else if (useJsonFallback) {
  const jsonPath = join(__dirname, "../firebase-service-account.json"); // /// your file lives at backend/firebase-service-account.json
  if (existsSync(jsonPath)) {
    const sa = JSON.parse(readFileSync(jsonPath, "utf8"));
    credentialConfig = {
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key,
    };
  }
}

if (!admin.apps.length) {
  if (!credentialConfig) {
    throw new Error(
      "Firebase Admin credentials missing. Set FIREBASE_* env vars in production, or add local JSON for dev."
    );
  }
  admin.initializeApp({ credential: admin.credential.cert(credentialConfig) });
}

export default admin;
