import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Import pages
import Dashboard from "../pages/Dashboard/index";

const Authmiddleware = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-page-wrapper pt-5">
        <div className="auth-page-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 col-xl-5 text-center">
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Public routes that don't require authentication
export const publicRoutes = [
  { path: "/login", component: React.lazy(() => import("../pages/Authentication/Login")) },
  { path: "/forgot-password", component: React.lazy(() => import("../pages/Authentication/ForgotPassword")) },
  { path: "/auth/callback", component: React.lazy(() => import("../pages/Authentication/AuthCallback")) },
];

// Protected routes that require authentication
export const protectedRoutes = [
  { path: "/", exact: true, component: () => <Navigate to="/dashboard" /> },
  { path: "/dashboard", component: Dashboard },
  // Add more protected routes here as they are implemented
];

export default Authmiddleware;
