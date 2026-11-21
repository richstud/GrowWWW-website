// Generated from the GrowWWW Supabase project (aryvikihjbpedoytwkxc) on 10 Nov 2026.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      client_logos: {
        Row: {
          company_name: string
          created_at: string
          display_order: number
          id: string
          logo_url: string
          website_url: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          display_order?: number
          id?: string
          logo_url: string
          website_url?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          display_order?: number
          id?: string
          logo_url?: string
          website_url?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          budget: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          ip_hash: string | null
          message: string | null
          name: string
          phone: string | null
          service: string | null
          source_page: string | null
          status: string
          telegram_sent: boolean
        }
        Insert: {
          admin_notes?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          ip_hash?: string | null
          message?: string | null
          name: string
          phone?: string | null
          service?: string | null
          source_page?: string | null
          status?: string
          telegram_sent?: boolean
        }
        Update: {
          admin_notes?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          ip_hash?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          service?: string | null
          source_page?: string | null
          status?: string
          telegram_sent?: boolean
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          challenge: string | null
          client_name: string
          cover_url: string | null
          created_at: string
          display_order: number
          gallery: string[]
          id: string
          industry: string | null
          is_featured: boolean
          is_published: boolean
          location: string | null
          logo_url: string | null
          result: string | null
          services: string[]
          slug: string
          solution: string | null
          summary: string | null
          title: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          challenge?: string | null
          client_name: string
          cover_url?: string | null
          created_at?: string
          display_order?: number
          gallery?: string[]
          id?: string
          industry?: string | null
          is_featured?: boolean
          is_published?: boolean
          location?: string | null
          logo_url?: string | null
          result?: string | null
          services?: string[]
          slug: string
          solution?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          challenge?: string | null
          client_name?: string
          cover_url?: string | null
          created_at?: string
          display_order?: number
          gallery?: string[]
          id?: string
          industry?: string | null
          is_featured?: boolean
          is_published?: boolean
          location?: string | null
          logo_url?: string | null
          result?: string | null
          services?: string[]
          slug?: string
          solution?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          cta_url: string | null
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          price_label: string | null
          short_description: string | null
          slug: string
          thumbnail_url: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          cta_url?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          price_label?: string | null
          short_description?: string | null
          slug: string
          thumbnail_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          cta_url?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          price_label?: string | null
          short_description?: string | null
          slug?: string
          thumbnail_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Update"]
export type Enums<T extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][T]

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
