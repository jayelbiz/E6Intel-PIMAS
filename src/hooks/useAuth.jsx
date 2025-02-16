import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    signUpWithEmail: async (email, password, metadata = {}) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        });
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
      }
    },

    signInWithEmail: async (email, password) => {
      try {
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser(session.user);
        return { data: session, error: null };
      } catch (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }
    },

    signInWithProvider: async (provider) => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Provider sign in error:', error);
        return { data: null, error };
      }
    },

    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        navigate('/login');
        return { error: null };
      } catch (error) {
        console.error('Sign out error:', error);
        return { error };
      }
    },

    resetPassword: async (email) => {
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Reset password error:', error);
        return { data: null, error };
      }
    },

    updatePassword: async (newPassword) => {
      try {
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Update password error:', error);
        return { data: null, error };
      }
    },

    updateProfile: async (updates) => {
      try {
        const { data, error } = await supabase.auth.updateUser({ data: updates });
        if (error) throw error;
        setUser(data.user);
        return { data, error: null };
      } catch (error) {
        console.error('Update profile error:', error);
        return { data: null, error };
      }
    },

    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
