import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    initialize();

    // Subscribe to auth changes
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      setUser(data.user);
      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      return { error: err };
    }
  };

  const signInWithProvider = async (provider) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Social sign in error:', err);
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const signUp = async (email, password) => {
    try {
      setError(null);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      setUser(data.user);
      return { error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      return { error: null };
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message);
      return { error: err };
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
      return { error: null };
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message);
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signInWithProvider,
        signUp,
        signOut,
        resetPassword,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
