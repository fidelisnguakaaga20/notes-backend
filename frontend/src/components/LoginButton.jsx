import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      // Try popup first
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error.code === "auth/popup-blocked") {
        // Fallback to redirect if popup is blocked
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.error("Login error:", error.message);
      }
    }
  };

  return (
    <button onClick={handleLogin} className="btn btn-primary">
      Sign in with Google
    </button>
  );
};

export default LoginButton;
