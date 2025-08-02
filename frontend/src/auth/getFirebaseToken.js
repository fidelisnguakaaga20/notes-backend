import { getAuth } from "firebase/auth";

export async function getFirebaseToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}
