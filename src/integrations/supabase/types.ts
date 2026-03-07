export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
          target_type: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      ai_call_logs: {
        Row: {
          completion_tokens: number | null
          created_at: string | null
          duration_ms: number | null
          error_code: string | null
          error_message: string | null
          function_name: string
          id: string
          inquiry_id: string | null
          model_used: string | null
          prompt_tokens: number | null
          status: string
          total_tokens: number | null
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_code?: string | null
          error_message?: string | null
          function_name: string
          id?: string
          inquiry_id?: string | null
          model_used?: string | null
          prompt_tokens?: number | null
          status?: string
          total_tokens?: number | null
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_code?: string | null
          error_message?: string | null
          function_name?: string
          id?: string
          inquiry_id?: string | null
          model_used?: string | null
          prompt_tokens?: number | null
          status?: string
          total_tokens?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_call_logs_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      click_events: {
        Row: {
          browser: string | null
          created_at: string
          device_type: string | null
          element_id: string | null
          element_text: string | null
          element_type: string
          id: string
          ip_address: string | null
          page_path: string
          session_id: string | null
          user_agent: string | null
          visitor_type: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          element_id?: string | null
          element_text?: string | null
          element_type: string
          id?: string
          ip_address?: string | null
          page_path: string
          session_id?: string | null
          user_agent?: string | null
          visitor_type?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          element_id?: string | null
          element_text?: string | null
          element_type?: string
          id?: string
          ip_address?: string | null
          page_path?: string
          session_id?: string | null
          user_agent?: string | null
          visitor_type?: string | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          ai_analysis: string | null
          company: string
          created_at: string
          email: string | null
          id: string
          inquiry_type: string
          marketing_agreed: boolean
          meeting_notes: string | null
          message: string | null
          name: string
          notes: string | null
          phone: string
          proposal_data: Json | null
          service: string | null
          session_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ai_analysis?: string | null
          company: string
          created_at?: string
          email?: string | null
          id?: string
          inquiry_type?: string
          marketing_agreed?: boolean
          meeting_notes?: string | null
          message?: string | null
          name: string
          notes?: string | null
          phone: string
          proposal_data?: Json | null
          service?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ai_analysis?: string | null
          company?: string
          created_at?: string
          email?: string | null
          id?: string
          inquiry_type?: string
          marketing_agreed?: boolean
          meeting_notes?: string | null
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string
          proposal_data?: Json | null
          service?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiry_analyses: {
        Row: {
          analysis_status: string
          cost_scenarios: Json | null
          created_at: string | null
          customer_profile: Json | null
          error_message: string | null
          feature_mapping: Json | null
          id: string
          inquiry_id: string
          is_frozen: boolean
          meeting_agenda: Json | null
          recommended_plan: string | null
          response_email_draft: string | null
          risk_flags: Json | null
          strategic_score: Json | null
        }
        Insert: {
          analysis_status?: string
          cost_scenarios?: Json | null
          created_at?: string | null
          customer_profile?: Json | null
          error_message?: string | null
          feature_mapping?: Json | null
          id?: string
          inquiry_id: string
          is_frozen?: boolean
          meeting_agenda?: Json | null
          recommended_plan?: string | null
          response_email_draft?: string | null
          risk_flags?: Json | null
          strategic_score?: Json | null
        }
        Update: {
          analysis_status?: string
          cost_scenarios?: Json | null
          created_at?: string | null
          customer_profile?: Json | null
          error_message?: string | null
          feature_mapping?: Json | null
          id?: string
          inquiry_id?: string
          is_frozen?: boolean
          meeting_agenda?: Json | null
          recommended_plan?: string | null
          response_email_draft?: string | null
          risk_flags?: Json | null
          strategic_score?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_analyses_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: true
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          duration_seconds: number | null
          id: string
          ip_address: string | null
          is_first_visit: boolean | null
          language: string | null
          os: string | null
          page_path: string
          referrer: string | null
          screen_height: number | null
          screen_width: number | null
          scroll_depth: number | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_type: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: string | null
          is_first_visit?: boolean | null
          language?: string | null
          os?: string | null
          page_path: string
          referrer?: string | null
          screen_height?: number | null
          screen_width?: number | null
          scroll_depth?: number | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_type?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: string | null
          is_first_visit?: boolean | null
          language?: string | null
          os?: string | null
          page_path?: string
          referrer?: string | null
          screen_height?: number | null
          screen_width?: number | null
          scroll_depth?: number | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_type?: string | null
        }
        Relationships: []
      }
      proposal_edit_logs: {
        Row: {
          created_at: string
          edit_summary: string | null
          editor_email: string
          editor_id: string
          id: string
          inquiry_id: string
          new_data: Json | null
          previous_data: Json | null
        }
        Insert: {
          created_at?: string
          edit_summary?: string | null
          editor_email: string
          editor_id: string
          id?: string
          inquiry_id: string
          new_data?: Json | null
          previous_data?: Json | null
        }
        Update: {
          created_at?: string
          edit_summary?: string | null
          editor_email?: string
          editor_id?: string
          id?: string
          inquiry_id?: string
          new_data?: Json | null
          previous_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_edit_logs_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          amount: string | null
          company: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          preferred_datetime: string | null
          reason: string | null
          request_type: string
          session_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: string | null
          company: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          preferred_datetime?: string | null
          reason?: string | null
          request_type: string
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: string | null
          company?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          preferred_datetime?: string | null
          reason?: string | null
          request_type?: string
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "super_admin"],
    },
  },
} as const
