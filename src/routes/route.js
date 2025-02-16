import React from 'react';
import { Navigate } from 'react-router-dom';

// Authentication pages
const Login = React.lazy(() => import('../pages/Authentication/Login'));
const Register = React.lazy(() => import('../pages/Authentication/Register'));
const ForgotPassword = React.lazy(() => import('../pages/Authentication/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/Authentication/ResetPassword'));
const AuthCallback = React.lazy(() => import('../pages/Authentication/AuthCallback'));

// Main pages
const Dashboard = React.lazy(() => import('../pages/Dashboard/index'));
const News = React.lazy(() => import('../pages/News/index'));
const Map = React.lazy(() => import('../pages/Map/index'));
const Analysis = React.lazy(() => import('../pages/Analysis/index'));
const Profile = React.lazy(() => import('../pages/Profile/index'));
const Settings = React.lazy(() => import('../pages/Settings/index'));

const publicRoutes = [
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />
    },
    {
        path: '/reset-password',
        element: <ResetPassword />
    },
    {
        path: '/auth/callback',
        element: <AuthCallback />
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />
    }
];

const protectedRoutes = [
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />
    },
    {
        path: '/news',
        element: <News />
    },
    {
        path: '/news/:id',
        element: <News />
    },
    {
        path: '/map',
        element: <Map />
    },
    {
        path: '/analysis',
        element: <Analysis />
    },
    {
        path: '/profile',
        element: <Profile />
    },
    {
        path: '/settings',
        element: <Settings />
    }
];

export { publicRoutes, protectedRoutes };
