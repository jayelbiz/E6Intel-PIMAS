import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../config/supabase';

// Auth pages
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import ResetPassword from '../pages/Authentication/ResetPassword';
import UserProfile from '../pages/Profile/UserProfile';
import SessionManagement from '../pages/Profile/SessionManagement';
import RoleManagement from '../pages/Admin/RoleManagement';

// Handle OAuth callbacks and email verification
const AuthCallback = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        // If we have a session, redirect to dashboard
        if (session) {
          window.location.href = '/dashboard';
        } else {
          // If no session, something went wrong with the OAuth flow
          throw new Error('Authentication failed. Please try again.');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
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
      <div className="auth-page-wrapper pt-5">
        <div className="auth-page-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 col-xl-5 text-center">
                <div className="card mt-4">
                  <div className="card-body p-4">
                    <div className="text-center mt-2">
                      <i className="pi pi-exclamation-circle text-danger" style={{ fontSize: '5rem' }}></i>
                      <h2 className="mt-4 fw-semibold">Authentication Error</h2>
                      <p className="text-muted">{error}</p>
                      <p className="text-muted">Redirecting to login...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper pt-5">
      <div className="auth-page-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5 text-center">
              <div className="card mt-4">
                <div className="card-body p-4">
                  <div className="text-center mt-2">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '5rem' }}></i>
                    <h2 className="mt-4 fw-semibold">Completing Authentication</h2>
                    <p className="text-muted">Please wait...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth route wrapper
export const PrivateRoute = ({ children, requiredPermissions = [] }) => {
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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public route wrapper (redirects to dashboard if already authenticated)
export const PublicRoute = ({ children }) => {
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
