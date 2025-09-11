import { signInWithPopup } from "firebase/auth"; 
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { googleProvider } from "../lib/firebase"; // ✅ correct


const Navbar = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        <a className="text-xl font-bold">MERN NOTES APP</a>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.displayName}
            </span>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          </div>
        ) : (
  <button
    onClick={() => signInWithPopup(auth, googleProvider)} /// <<< ✅ add this
    className="btn btn-primary btn-sm"
  >
    Login with Google
  </button>
)}
      </div>
    </div>
  );
};

export default Navbar;
