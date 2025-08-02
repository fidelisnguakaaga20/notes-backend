import admin from "firebase-admin";
import fs from "fs";

// Load your service account key JSON
const serviceAccount = JSON.parse(
  fs.readFileSync("./service-account.json", "utf-8") // rename if needed
);

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Replace with your Firebase Auth user UID
const uid = "WVq9lxcXGJdJAi9fGMNS4NPziVq2";  /// ✅
const ALLOWED_UID = "WVq9lxcXGJdJAi9fGMNS4NPziVq2";  /// ✅

admin
  .auth()
  .createCustomToken(uid)
  .then((customToken) => {
    console.log("Custom Token:", customToken);
  })
  .catch((error) => {
    console.error("Error creating custom token:", error);
  });
