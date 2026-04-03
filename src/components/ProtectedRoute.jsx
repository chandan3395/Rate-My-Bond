import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// This component acts as a wrapper — it either renders
// what's inside it (the protected page) or redirects away.
function ProtectedRoute({ children }) {
  const { user } = useAuth(); // grab the logged-in user from our Auth Context

  // If there's no logged-in user, redirect to sign in.
  // The "replace" prop means this redirect replaces the current
  // history entry — so pressing back won't loop them back to /calculator.
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // User is logged in — render whatever was passed as children
  return children;
}

export default ProtectedRoute;