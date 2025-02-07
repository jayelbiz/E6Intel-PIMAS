import { analytics } from './firebase'
import { logEvent as firebaseLogEvent } from 'firebase/analytics'

type EventName =
  | 'page_view'
  | 'search'
  | 'news_article_view'
  | 'event_view'
  | 'map_interaction'
  | 'analysis_view'
  | 'report_submission'
  | 'alert_triggered'

interface EventParams {
  [key: string]: any
}

export function logEvent(eventName: EventName, params?: EventParams) {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params)
  }
}

// Utility functions for common events
export const analyticsEvents = {
  pageView: (pageName: string) => {
    logEvent('page_view', { page_name: pageName })
  },

  viewArticle: (articleId: string, title: string, type: string) => {
    logEvent('news_article_view', {
      article_id: articleId,
      title,
      type
    })
  },

  viewEvent: (eventId: string, type: string, severity: string) => {
    logEvent('event_view', {
      event_id: eventId,
      type,
      severity
    })
  },

  mapInteraction: (action: 'zoom' | 'pan' | 'marker_click', details?: object) => {
    logEvent('map_interaction', {
      action,
      ...details
    })
  },

  submitReport: (type: string, source: 'manual' | 'url') => {
    logEvent('report_submission', {
      type,
      source
    })
  },

  alertTriggered: (type: string, severity: string) => {
    logEvent('alert_triggered', {
      type,
      severity
    })
  }
}