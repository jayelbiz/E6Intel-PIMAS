import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Auth pages
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import ResetPassword from '../pages/Authentication/ResetPassword';
import UserProfile from '../pages/Profile/UserProfile';
import SessionManagement from '../pages/Profile/SessionManagement';
import RoleManagement from '../pages/Admin/RoleManagement';

// Handle OAuth callbacks and email verification
const AuthCallback = () => {
  const { getSession } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { error } = await getSession();
        if (error) throw error;
        window.location.href = '/dashboard';
      } catch (err) {
        setError(err.message);
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    };

    handleCallback();
  }, [getSession]);

  if (error) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="text-center">
          <i className="pi pi-exclamation-circle text-5xl text-red-500 mb-4"></i>
          <h2>Authentication Error</h2>
          <p className="text-600">{error}</p>
          <p className="text-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <div className="text-center">
        <i className="pi pi-spin pi-spinner text-5xl mb-4"></i>
        <h2>Completing Authentication</h2>
        <p className="text-600">Please wait...</p>
      </div>
    </div>
  );
};

// Auth route wrapper
export const PrivateRoute = ({ children, requiredPermissions = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <i className="pi pi-spin pi-spinner text-4xl"></i>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every(permission =>
      user.permissions?.includes(permission)
    );

    if (!hasPermission) {
      return (
        <div className="flex align-items-center justify-content-center min-h-screen">
          <div className="text-center">
            <i className="pi pi-lock text-5xl text-red-500 mb-4"></i>
            <h2>Access Denied</h2>
            <p className="text-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return children;
};

// Public route wrapper (redirects to dashboard if already authenticated)
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <i className="pi pi-spin pi-spinner text-4xl"></i>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Auth routes configuration
export const authRoutes = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: '/auth/reset-password',
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <UserProfile />
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/sessions',
    element: (
      <PrivateRoute>
        <SessionManagement />
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/roles',
    element: (
      <PrivateRoute requiredPermissions={['manage_roles']}>
        <RoleManagement />
      </PrivateRoute>
    ),
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
];
