import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//This function makes sure that the user is authenticated before rendering the protected route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
