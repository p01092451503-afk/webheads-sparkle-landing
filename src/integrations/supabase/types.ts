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
      backup_files: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          folder: string
          id: string
          memo: string | null
          uploaded_by: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          folder?: string
          id?: string
          memo?: string | null
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          folder?: string
          id?: string
          memo?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      chatbot_conversations: {
        Row: {
          created_at: string | null
          first_message: string | null
          id: string
          language: string | null
          message_count: number | null
          messages: Json
          session_id: string | null
          total_cost: number | null
          total_tokens: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_message?: string | null
          id?: string
          language?: string | null
          message_count?: number | null
          messages?: Json
          session_id?: string | null
          total_cost?: number | null
          total_tokens?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_message?: string | null
          id?: string
          language?: string | null
          message_count?: number | null
          messages?: Json
          session_id?: string | null
          total_cost?: number | null
          total_tokens?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      checklist_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          sort_order: number
          task_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          task_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          task_name?: string
        }
        Relationships: []
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
      client_comm_logs: {
        Row: {
          company_id: string
          content: string | null
          created_at: string
          id: string
          log_date: string
          log_type: string
          logged_by: string | null
          title: string | null
        }
        Insert: {
          company_id: string
          content?: string | null
          created_at?: string
          id?: string
          log_date?: string
          log_type?: string
          logged_by?: string | null
          title?: string | null
        }
        Update: {
          company_id?: string
          content?: string | null
          created_at?: string
          id?: string
          log_date?: string
          log_type?: string
          logged_by?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_comm_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "client_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      client_companies: {
        Row: {
          address1: string | null
          address2: string | null
          business_item: string | null
          business_number: string
          business_type: string | null
          ceo_name: string | null
          company_name: string
          created_at: string
          id: string
          is_active: boolean
          num: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          business_item?: string | null
          business_number: string
          business_type?: string | null
          ceo_name?: string | null
          company_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          num?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          business_item?: string | null
          business_number?: string
          business_type?: string | null
          ceo_name?: string | null
          company_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          num?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      client_contacts: {
        Row: {
          company_id: string
          created_at: string
          department: string | null
          email: string | null
          id: string
          mobile: string | null
          name: string | null
          phone: string | null
          position: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name?: string | null
          phone?: string | null
          position?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name?: string | null
          phone?: string | null
          position?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "client_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      client_projects: {
        Row: {
          company_id: string
          contract_amount: number | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string
          description: string | null
          id: string
          project_name: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          contract_amount?: number | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          project_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          contract_amount?: number | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          project_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "client_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      client_recurring_fees: {
        Row: {
          amount: number
          billing_cycle: string
          client_id: string
          contract_start_date: string | null
          created_at: string
          id: string
          is_active: boolean
          payment_type: string
          updated_at: string
        }
        Insert: {
          amount?: number
          billing_cycle?: string
          client_id: string
          contract_start_date?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          payment_type?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_cycle?: string
          client_id?: string
          contract_start_date?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          payment_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_recurring_fees_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_no: number | null
          created_at: string | null
          expected_payment_day: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          sort_order: number | null
        }
        Insert: {
          client_no?: number | null
          created_at?: string | null
          expected_payment_day?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          sort_order?: number | null
        }
        Update: {
          client_no?: number | null
          created_at?: string | null
          expected_payment_day?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          ai_analysis: string | null
          ai_analysis_v2: Json | null
          company: string
          created_at: string
          email: string | null
          email_reply_summary: string | null
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
          ai_analysis_v2?: Json | null
          company: string
          created_at?: string
          email?: string | null
          email_reply_summary?: string | null
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
          ai_analysis_v2?: Json | null
          company?: string
          created_at?: string
          email?: string | null
          email_reply_summary?: string | null
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
      cookie_consent_logs: {
        Row: {
          action: string
          analytics: boolean
          city: string | null
          country: string | null
          created_at: string
          essential: boolean
          id: string
          ip_address: string | null
          language: string | null
          marketing: boolean
          session_id: string | null
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          action?: string
          analytics?: boolean
          city?: string | null
          country?: string | null
          created_at?: string
          essential?: boolean
          id?: string
          ip_address?: string | null
          language?: string | null
          marketing?: boolean
          session_id?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          action?: string
          analytics?: boolean
          city?: string | null
          country?: string | null
          created_at?: string
          essential?: boolean
          id?: string
          ip_address?: string | null
          language?: string | null
          marketing?: boolean
          session_id?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      expense_attachments: {
        Row: {
          content_type: string | null
          created_at: string
          expense_id: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          expense_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          expense_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_attachments_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          color: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      expense_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          month: number
          updated_at: string
          year: number
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          month: number
          updated_at?: string
          year: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          month?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: string | null
          client_id: string | null
          created_at: string
          description: string | null
          id: string
          invoice_issued: boolean
          is_paid: boolean
          memo: string | null
          month: number
          paid_date: string | null
          payment_method: string
          supply_amount: number
          tax_amount: number
          updated_at: string
          vendor_id: string | null
          vendor_name: string | null
          year: number
        }
        Insert: {
          amount?: number
          category_id?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invoice_issued?: boolean
          is_paid?: boolean
          memo?: string | null
          month: number
          paid_date?: string | null
          payment_method?: string
          supply_amount?: number
          tax_amount?: number
          updated_at?: string
          vendor_id?: string | null
          vendor_name?: string | null
          year: number
        }
        Update: {
          amount?: number
          category_id?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invoice_issued?: boolean
          is_paid?: boolean
          memo?: string | null
          month?: number
          paid_date?: string | null
          payment_method?: string
          supply_amount?: number
          tax_amount?: number
          updated_at?: string
          vendor_id?: string | null
          vendor_name?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
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
      inquiry_attachments: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          inquiry_id: string
          uploaded_by: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          inquiry_id: string
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          inquiry_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_attachments_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_checklists: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          is_completed: boolean
          month: number
          sort_order: number
          task_name: string
          year: number
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          month: number
          sort_order?: number
          task_name: string
          year: number
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          month?: number
          sort_order?: number
          task_name?: string
          year?: number
        }
        Relationships: []
      }
      not_found_logs: {
        Row: {
          created_at: string
          id: string
          path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
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
          visit_count: number | null
          visitor_id: string | null
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
          visit_count?: number | null
          visitor_id?: string | null
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
          visit_count?: number | null
          visitor_id?: string | null
          visitor_type?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          client_id: string
          created_at: string | null
          id: string
          invoice_date: string | null
          invoice_status: string
          is_recurring: boolean
          is_unpaid: boolean | null
          memo: string | null
          month: number
          paid_date: string | null
          payment_type: string
          remarks: string | null
          updated_at: string | null
          year: number
        }
        Insert: {
          amount?: number | null
          client_id: string
          created_at?: string | null
          id?: string
          invoice_date?: string | null
          invoice_status?: string
          is_recurring?: boolean
          is_unpaid?: boolean | null
          memo?: string | null
          month: number
          paid_date?: string | null
          payment_type?: string
          remarks?: string | null
          updated_at?: string | null
          year: number
        }
        Update: {
          amount?: number | null
          client_id?: string
          created_at?: string | null
          id?: string
          invoice_date?: string | null
          invoice_status?: string
          is_recurring?: boolean
          is_unpaid?: boolean | null
          memo?: string | null
          month?: number
          paid_date?: string | null
          payment_type?: string
          remarks?: string | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      project_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          note_type: string
          project_id: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          note_type?: string
          project_id: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note_type?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
        ]
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
      simulator_leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          monthly_total: number
          name: string
          plan_recommended: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          monthly_total?: number
          name: string
          plan_recommended: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          monthly_total?: number
          name?: string
          plan_recommended?: string
        }
        Relationships: []
      }
      tax_invoice_logs: {
        Row: {
          buyer_ceo_name: string | null
          buyer_corp_name: string | null
          buyer_corp_num: string | null
          buyer_email: string | null
          client_id: string
          created_at: string
          id: string
          invoice_num: string | null
          issue_date: string | null
          memo: string | null
          nts_confirm_num: string | null
          payment_id: string | null
          popbill_response: Json | null
          status: string
          supplier_corp_num: string | null
          supply_amount: number
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_ceo_name?: string | null
          buyer_corp_name?: string | null
          buyer_corp_num?: string | null
          buyer_email?: string | null
          client_id: string
          created_at?: string
          id?: string
          invoice_num?: string | null
          issue_date?: string | null
          memo?: string | null
          nts_confirm_num?: string | null
          payment_id?: string | null
          popbill_response?: Json | null
          status?: string
          supplier_corp_num?: string | null
          supply_amount?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          buyer_ceo_name?: string | null
          buyer_corp_name?: string | null
          buyer_corp_num?: string | null
          buyer_email?: string | null
          client_id?: string
          created_at?: string
          id?: string
          invoice_num?: string | null
          issue_date?: string | null
          memo?: string | null
          nts_confirm_num?: string | null
          payment_id?: string | null
          popbill_response?: Json | null
          status?: string
          supplier_corp_num?: string | null
          supply_amount?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_invoice_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_invoice_logs_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
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
      vendors: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      work_files: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          folder: string
          id: string
          memo: string | null
          uploaded_by: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          folder?: string
          id?: string
          memo?: string | null
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          folder?: string
          id?: string
          memo?: string | null
          uploaded_by?: string | null
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
