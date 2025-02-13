import { supabase } from '../config/supabase';

export const newsService = {
  // News Articles
  async createArticle(articleData) {
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select();
    return { data, error };
  },

  async getArticles(filters = {}) {
    let query = supabase.from('articles')
      .select(`
        *,
        article_analysis (
          sentiment_score,
          bias_indicator,
          analysis_summary
        )
      `);
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.date) {
      query = query.gte('published_at', filters.date);
    }
    if (filters.location) {
      const { latitude, longitude, radius } = filters.location;
      const { data } = await supabase.rpc('get_articles_within_radius', {
        center_point: `POINT(${longitude} ${latitude})`,
        radius_miles: radius
      });
      return { data };
    }
    
    const { data, error } = await query
      .order('published_at', { ascending: false })
      .limit(filters.limit || 10)
      .offset(filters.offset || 0);
    return { data, error };
  },

  async getArticleById(id) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        article_analysis (*)
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  async searchArticles(query, limit = 10, offset = 0) {
    const { data, error } = await supabase.rpc('search_articles', {
      search_query: query,
      p_limit: limit,
      p_offset: offset
    });
    return { data, error };
  }
};

export const analysisService = {
  // AI Analysis
  async createAnalysis(analysisData) {
    const { data, error } = await supabase
      .from('article_analysis')
      .insert([analysisData])
      .select();
    return { data, error };
  },

  async getAnalysisByArticleId(articleId) {
    const { data, error } = await supabase
      .from('article_analysis')
      .select('*')
      .eq('article_id', articleId)
      .single();
    return { data, error };
  },

  async getAnalysisByCategory(category, limit = 10) {
    const { data, error } = await supabase.rpc('get_articles_by_category', {
      p_category: category,
      p_limit: limit
    });
    return { data, error };
  }
};

export const bookmarkService = {
  // User Bookmarks
  async toggleBookmark(articleId) {
    const { data, error } = await supabase.rpc('toggle_bookmark', {
      p_article_id: articleId
    });
    return { data, error };
  },

  async getUserBookmarks() {
    const { data, error } = await supabase.rpc('get_user_bookmarks');
    return { data, error };
  },

  subscribeToBookmarks(callback) {
    return supabase
      .channel('bookmarks_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks'
        },
        callback
      )
      .subscribe();
  }
};

export const alertService = {
  async updateAlertPreferences(preferences) {
    const { data, error } = await supabase
      .from('user_alert_preferences')
      .upsert(preferences)
      .select();
    return { data, error };
  },

  async getAlertPreferences() {
    const { data, error } = await supabase
      .from('user_alert_preferences')
      .select('*');
    return { data, error };
  },

  subscribeToAlerts(callback) {
    return supabase
      .channel('alerts_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'articles',
          filter: 'event_severity=gt.3'
        },
        callback
      )
      .subscribe();
  }
};

export const cacheService = {
  async getCachedData(key) {
    const { data, error } = await supabase
      .from('news_cache')
      .select('data')
      .eq('cache_key', key)
      .gt('expires_at', new Date().toISOString())
      .single();
    return { data: data?.data, error };
  },

  async setCachedData(key, data, expiresIn = '5 minutes') {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const { error } = await supabase
      .from('news_cache')
      .upsert({
        cache_key: key,
        data,
        expires_at: expiresAt.toISOString()
      });
    return { error };
  }
};
