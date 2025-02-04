export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          timezone: string
          email_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          timezone?: string
          email_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          timezone?: string
          email_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
          severity: 'low' | 'medium' | 'high'
          occurred_at: string
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
          severity: 'low' | 'medium' | 'high'
          occurred_at: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
          severity?: 'low' | 'medium' | 'high'
          occurred_at?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
    }
  }
}