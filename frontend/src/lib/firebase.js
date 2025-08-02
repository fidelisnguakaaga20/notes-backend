import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCX5dCcio9mRTiUftQ1ebaWjJ5_sD8htDE", // ✅ correct this exactly
  authDomain: "nd-mern-project.firebaseapp.com",
  projectId: "nd-mern-project",
  storageBucket: "nd-mern-project.appspot.com",     // ✅ fix: should be 'appspot.com'
  messagingSenderId: "203188764065",
  appId: "1:203188764065:web:8335630afbcc785aca9fe0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
