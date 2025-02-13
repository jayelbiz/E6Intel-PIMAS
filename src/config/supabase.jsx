import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signInWithProvider: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  signOut: async (allSessions = false) => {
    const { error } = await supabase.auth.signOut({
      scope: allSessions ? 'global' : 'local'
    });
    return { error };
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  },

  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  },

  updateProfile: async (updates) => {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: updates
    });
    return { user, error };
  },

  verifyEmail: async (token, email) => {
    const { error } = await supabase.auth.verifyOtp({
      token,
      type: 'email',
      email
    });
    return { error };
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Role Management
  getUserRoles: async (userId) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    return { roles: data?.map(r => r.role) || [], error };
  },

  checkPermission: async (userId, permission) => {
    const { data, error } = await supabase
      .rpc('check_user_permission', {
        p_user_id: userId,
        p_permission: permission
      });
    return { hasPermission: data || false, error };
  },

  getUserPermissions: async (userId) => {
    const { data, error } = await supabase
      .rpc('get_user_permissions', {
        p_user_id: userId
      });
    return { permissions: data || [], error };
  },

  assignRole: async (userId, role) => {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role,
        assigned_by: (await supabase.auth.getUser()).data.user?.id
      });
    return { data, error };
  },

  // Session Management
  getActiveSessions: async () => {
    const { data, error } = await supabase
      .from('active_sessions')
      .select('*')
      .order('last_active', { ascending: false });
    return { sessions: data || [], error };
  },

  terminateSession: async (sessionId) => {
    const { error } = await supabase
      .from('active_sessions')
      .delete()
      .eq('session_id', sessionId);
    return { error };
  },

  terminateAllSessions: async (userId) => {
    const { error } = await supabase
      .from('active_sessions')
      .delete()
      .eq('user_id', userId);
    
    if (!error) {
      await auth.signOut(true);
    }
    return { error };
  },

  // Get user profile data
  getUserProfile: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return { profile: null, error };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { roles } = await auth.getUserRoles(user.id);
    const { permissions } = await auth.getUserPermissions(user.id);

    return { 
      profile: {
        ...profile,
        roles,
        permissions
      }, 
      error: profileError 
    };
  },

  // Update user profile data
  updateUserProfile: async (updates) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return { profile: null, error: userError };

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        updated_at: new Date().toISOString(),
        ...updates
      })
      .select()
      .single();

    return { profile, error };
  }
};
