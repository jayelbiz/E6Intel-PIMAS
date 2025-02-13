import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../config/supabase';

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
        const { session, error: sessionError } = await auth.getSession();
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
    const { data: authListener } = auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in hook:', event);
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
      const { user: authUser, error: signInError } = await auth.signIn(email, password);
      if (signInError) throw signInError;
      setUser(authUser);
      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      return { error: err };
    }
  };

  const signUp = async (email, password) => {
    try {
      setError(null);
      const { user: authUser, error: signUpError } = await auth.signUp(email, password);
      if (signUpError) throw signUpError;
      setUser(authUser);
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
      const { error: signOutError } = await auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      return { error: null };
    } catch (err) {
      console.error('Sign out error:', err);
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
        signUp,
        signOut,
        setError
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
