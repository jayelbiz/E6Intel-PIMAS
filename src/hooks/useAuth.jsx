import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { session, error: sessionError } = await auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Auth error:', err);
        setError(err.message || 'Failed to check authentication session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      const { error: signInError } = await auth.signIn(email, password);
      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }
    } catch (err) {
      console.error('Sign in failed:', err);
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const signUp = async (email, password) => {
    try {
      setError(null);
      const { error: signUpError } = await auth.signUp(email, password);
      if (signUpError) {
        console.error('Sign up error:', signUpError);
        throw signUpError;
      }
    } catch (err) {
      console.error('Sign up failed:', err);
      setError(err.message || 'Failed to create account');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error: signOutError } = await auth.signOut();
      if (signOutError) {
        console.error('Sign out error:', signOutError);
        throw signOutError;
      }
    } catch (err) {
      console.error('Sign out failed:', err);
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
