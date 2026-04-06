import { useAppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // ✅ Logged in
  return children;
};

export default ProtectedRoute;