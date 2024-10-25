import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

// Protected routes no working

const ProtectedRoute = ({ children }) => {
  const { user, checkAuth } = useUserStore();

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
