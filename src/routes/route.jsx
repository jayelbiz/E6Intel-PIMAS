import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Import pages
import Dashboard from "../pages/Dashboard/index";
import News from "../pages/News/index";

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
  { path: "/news", component: News },
  { path: "/news/bookmarks", component: React.lazy(() => import("../pages/News/Bookmarks")) },
  { path: "/news/alerts", component: React.lazy(() => import("../pages/News/Alerts")) },
  { path: "/news/settings", component: React.lazy(() => import("../pages/News/Settings")) },
  { path: "/news/map", component: React.lazy(() => import("../pages/News/MapView")) },
  { path: "/news/analytics", component: React.lazy(() => import("../pages/News/Analytics")) },
  // Add more protected routes here as they are implemented
];

export default Authmiddleware;
