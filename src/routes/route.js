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

const publicRoutes = [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '*', component: () => <Navigate to="/login" /> }
];

const protectedRoutes = [
    { path: '/', component: Dashboard },
    { path: '/news', component: News },
    { path: '/news/:id', component: News },
    { path: '/map', component: Map },
    { path: '/analysis', component: Analysis },
    { path: '/profile', component: Profile },
    { path: '/settings', component: Settings }
];

export { publicRoutes, protectedRoutes };
