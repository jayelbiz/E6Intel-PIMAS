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
    let query = supabase.from('articles').select('*');
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.date) {
      query = query.gte('published_at', filters.date);
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  async getArticleById(id) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
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
  }
};

export const bookmarkService = {
  // User Bookmarks
  async addBookmark(userId, articleId) {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, article_id: articleId }])
      .select();
    return { data, error };
  },

  async removeBookmark(userId, articleId) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .match({ user_id: userId, article_id: articleId });
    return { error };
  },

  async getUserBookmarks(userId) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        article_id,
        articles (*)
      `)
      .eq('user_id', userId);
    return { data, error };
  }
};
