import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

// Step 1: Create the context object.
// Think of this as the WiFi router being set up —
// it exists but nobody is connected to it yet.
const AuthContext = createContext(null);

// Step 2: The Provider is the component that wraps your app
// and broadcasts the auth state to everyone inside it.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // the logged-in user object (or null)
  const [loading, setLoading] = useState(true);  // true while Firebase is checking auth state

  useEffect(() => {
    // onAuthStateChanged is a Firebase listener — it fires every time
    // the user logs in OR logs out, and also once on page load to
    // check if there's already a session (e.g. user refreshes the page).
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // null if logged out, user object if logged in
      setLoading(false);     // Firebase has responded, we're no longer in the dark
    });

    // Cleanup: when the component unmounts, stop listening to avoid memory leaks
    return () => unsubscribe();
  }, []);

  // Don't render anything until Firebase tells us the auth state.
  // Without this, there's a flash where the app thinks nobody is logged in
  // even if the user has an active session.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#081d1e]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#8fd7cf]" />
      </div>
    );
  }

  return (
    // Broadcast the user object to everyone inside
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: A custom hook so any component can just write:
// const { user } = useAuth();
// instead of the more verbose useContext(AuthContext) every time.
export function useAuth() {
  return useContext(AuthContext);
}