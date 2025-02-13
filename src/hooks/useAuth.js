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
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = auth.onAuthStateChange((event, session) => {
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
      if (signInError) throw signInError;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email, password) => {
    try {
      setError(null);
      const { error: signUpError } = await auth.signUp(email, password);
      if (signUpError) throw signUpError;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error: signOutError } = await auth.signOut();
      if (signOutError) throw signOutError;
    } catch (err) {
      setError(err.message);
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
