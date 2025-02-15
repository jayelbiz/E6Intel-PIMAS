import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const initSupabase = () => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: window.localStorage,
        cookieOptions: {
          secure: true,
          sameSite: 'strict'
        }
      },
      db: {
        schema: 'public'
      }
    });

    // Test the connection
    client.auth.onAuthStateChange((event, session) => {
      console.log('Supabase Auth State Change:', event, session?.user?.id);
    });

    return client;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
};

// Create Supabase instance
export const supabase = initSupabase();

// Auth helper functions
export const auth = {
  signUp: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign up failed:', error);
      return { data: null, error };
    }
  },

  signIn: async (email, password) => {
    try {
      console.log('Attempting sign in...', email); // Debug log
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log('Sign in successful:', data.user?.email); // Debug log
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in failed:', error);
      return { user: null, error };
    }
  },

  signInWithProvider: async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            scope: 'openid email profile',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in with provider failed:', error);
      return { data: null, error };
    }
  },

  signOut: async (allSessions = false) => {
    try {
      console.log('Attempting sign out...'); // Debug log
      const { error } = await supabase.auth.signOut({
        scope: allSessions ? 'global' : 'local'
      });
      if (error) throw error;
      console.log('Sign out successful'); // Debug log
      return { error: null };
    } catch (error) {
      console.error('Sign out failed:', error);
      return { error };
    }
  },

  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Reset password failed:', error);
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
      console.error('Update password failed:', error);
      return { data: null, error };
    }
  },

  updateProfile: async (updates) => {
    try {
      const { data: { user }, error } = await supabase.auth.updateUser({
        data: updates
      });
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      console.error('Update profile failed:', error);
      return { user: null, error };
    }
  },

  verifyEmail: async (token, email) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token,
        type: 'email',
        email
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Verify email failed:', error);
      return { error };
    }
  },

  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error) {
      console.error('Get session failed:', error);
      return { session: null, error };
    }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      callback(event, session);
    });
  },

  // Role Management
  getUserRoles: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      if (error) throw error;
      return { roles: data?.map(r => r.role) || [], error: null };
    } catch (error) {
      console.error('Get user roles failed:', error);
      return { roles: [], error };
    }
  },

  checkPermission: async (userId, permission) => {
    try {
      const { data, error } = await supabase
        .rpc('check_user_permission', {
          p_user_id: userId,
          p_permission: permission
        });
      if (error) throw error;
      return { hasPermission: data || false, error: null };
    } catch (error) {
      console.error('Check permission failed:', error);
      return { hasPermission: false, error };
    }
  },

  getUserPermissions: async (userId) => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_permissions', {
          p_user_id: userId
        });
      if (error) throw error;
      return { permissions: data || [], error: null };
    } catch (error) {
      console.error('Get user permissions failed:', error);
      return { permissions: [], error };
    }
  },

  assignRole: async (userId, role) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role,
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Assign role failed:', error);
      return { data: null, error };
    }
  },

  // Session Management
  getActiveSessions: async () => {
    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .order('last_active', { ascending: false });
      if (error) throw error;
      return { sessions: data || [], error: null };
    } catch (error) {
      console.error('Get active sessions failed:', error);
      return { sessions: [], error };
    }
  },

  terminateSession: async (sessionId) => {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .delete()
        .eq('session_id', sessionId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Terminate session failed:', error);
      return { error };
    }
  },

  terminateAllSessions: async (userId) => {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .delete()
        .eq('user_id', userId);
      if (error) throw error;
      if (!error) {
        await auth.signOut(true);
      }
      return { error: null };
    } catch (error) {
      console.error('Terminate all sessions failed:', error);
      return { error };
    }
  },

  // Get user profile data
  getUserProfile: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileError) throw profileError;
      const { roles } = await auth.getUserRoles(user.id);
      const { permissions } = await auth.getUserPermissions(user.id);
      return { 
        profile: {
          ...profile,
          roles,
          permissions
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Get user profile failed:', error);
      return { profile: null, error };
    }
  },

  // Update user profile data
  updateUserProfile: async (updates) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const { data: profile, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          updated_at: new Date().toISOString(),
          ...updates
        })
        .select()
        .single();
      if (error) throw error;
      return { profile, error: null };
    } catch (error) {
      console.error('Update user profile failed:', error);
      return { profile: null, error };
    }
  }
};

export default supabase;
