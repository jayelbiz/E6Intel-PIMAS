import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Auth pages
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import ResetPassword from '../pages/Authentication/ResetPassword';
import UserProfile from '../pages/Profile/UserProfile';

// Auth route wrapper
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <i className="pi pi-spin pi-spinner text-4xl"></i>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
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
    return <Navigate to="/dashboard" />;
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
    path: '/auth/callback',
    element: <AuthCallback />,
  },
];

// Handle OAuth callbacks and email verification
const AuthCallback = () => {
  const { getSession } = useAuth();
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
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
  }, []);

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
