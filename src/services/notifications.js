import { supabase } from '../config/supabase';

export const notificationService = {
  async getNotifications(options = {}) {
    const { limit = 20, offset = 0, unreadOnly = false } = options;
    
    let query = supabase
      .from('user_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .offset(offset);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async markAsRead(notificationId) {
    const { data, error } = await supabase
      .from('user_notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select();
    return { data, error };
  },

  async markAllAsRead() {
    const { error } = await supabase
      .from('user_notifications')
      .update({ read: true })
      .eq('read', false);
    return { error };
  },

  async deleteNotification(notificationId) {
    const { error } = await supabase
      .from('user_notifications')
      .delete()
      .eq('id', notificationId);
    return { error };
  },

  subscribeToNotifications(callback) {
    return supabase
      .channel('notifications_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${supabase.auth.user()?.id}`
        },
        callback
      )
      .subscribe();
  },

  // Alert Preferences
  async updateAlertPreferences(preferences) {
    const { data, error } = await supabase
      .from('user_alert_preferences')
      .upsert({
        ...preferences,
        user_id: supabase.auth.user()?.id
      })
      .select();
    return { data, error };
  },

  async getAlertPreferences() {
    const { data, error } = await supabase
      .from('user_alert_preferences')
      .select('*');
    return { data, error };
  },

  async muteAlerts(duration) {
    const mutedUntil = new Date();
    mutedUntil.setHours(mutedUntil.getHours() + duration);

    const { data, error } = await supabase
      .from('user_alert_preferences')
      .update({
        is_muted: true,
        muted_until: mutedUntil.toISOString()
      })
      .eq('user_id', supabase.auth.user()?.id)
      .select();
    return { data, error };
  },

  async unmuteAlerts() {
    const { data, error } = await supabase
      .from('user_alert_preferences')
      .update({
        is_muted: false,
        muted_until: null
      })
      .eq('user_id', supabase.auth.user()?.id)
      .select();
    return { data, error };
  }
};
