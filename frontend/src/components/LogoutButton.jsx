import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-outline btn-sm">
      Logout
    </button>
  );
};

export default LogoutButton;
