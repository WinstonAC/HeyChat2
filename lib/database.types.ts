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
      comments: {
        Row: {
          id: string
          content: string
          created_at: string
          author_name: string | null
          show_id: string
          user_id: string
          source_type: string | null
          parent_id: string | null
          pinned: boolean | null
          saved_by: string[] | null
          ingested: boolean | null
          relevance_score: number | null
        }
        Insert: {
          id?: string
          content: string
          created_at?: string
          author_name?: string | null
          show_id: string
          user_id: string
          source_type?: string | null
          parent_id?: string | null
          pinned?: boolean | null
          saved_by?: string[] | null
          ingested?: boolean | null
          relevance_score?: number | null
        }
        Update: {
          id?: string
          content?: string
          created_at?: string
          author_name?: string | null
          show_id?: string
          user_id?: string
          source_type?: string | null
          parent_id?: string | null
          pinned?: boolean | null
          saved_by?: string[] | null
          ingested?: boolean | null
          relevance_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_show_id_fkey"
            columns: ["show_id"]
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      shows: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          image_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 