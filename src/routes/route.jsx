import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Authmiddleware = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <i className="pi pi-spin pi-spinner text-4xl"></i>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default Authmiddleware;
