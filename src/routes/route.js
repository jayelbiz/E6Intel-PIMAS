import React from 'react';
import { Navigate } from 'react-router-dom';

// Public pages
const Login = React.lazy(() => import('../pages/Authentication/Login'));
const Register = React.lazy(() => import('../pages/Authentication/Register'));
const ForgotPassword = React.lazy(() => import('../pages/Authentication/ForgotPassword'));

// Private pages
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const News = React.lazy(() => import('../pages/News'));
const Map = React.lazy(() => import('../pages/Map'));
const Analysis = React.lazy(() => import('../pages/Analysis'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Settings = React.lazy(() => import('../pages/Settings'));

// Route configurations
const publicRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '*', element: <Navigate to="/login" /> }
];

const protectedRoutes = [
    { path: '/', element: <Dashboard /> },
    { path: '/news', element: <News /> },
    { path: '/news/:id', element: <News /> },
    { path: '/map', element: <Map /> },
    { path: '/analysis', element: <Analysis /> },
    { path: '/profile', element: <Profile /> },
    { path: '/settings', element: <Settings /> }
];

export { publicRoutes, protectedRoutes };
