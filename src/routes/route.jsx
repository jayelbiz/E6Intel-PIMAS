import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Import pages
import Dashboard from "../pages/Dashboard/index";

// Temporarily disable auth check for development
const Authmiddleware = ({ children }) => {
  // Always return children for development
  return children;
};

// Public routes that don't require authentication
export const publicRoutes = [
  // Redirect root to dashboard for development
  { path: "/", component: () => <Navigate to="/dashboard" /> },
];

// Protected routes that require authentication
export const protectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  // Add more protected routes here as they are implemented
];

export default Authmiddleware;
