export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          property_id: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status: Database["public"]["Enums"]["alert_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          property_id?: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          property_id?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          confidence_score: number | null
          created_at: string
          extracted_data: Json | null
          file_size: number
          file_type: string
          filename: string
          id: string
          processing_error: string | null
          processing_status: string
          storage_path: string
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          category?: string | null
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json | null
          file_size: number
          file_type: string
          filename: string
          id?: string
          processing_error?: string | null
          processing_status?: string
          storage_path: string
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          category?: string | null
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json | null
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          processing_error?: string | null
          processing_status?: string
          storage_path?: string
          updated_at?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      extracted_kpis: {
        Row: {
          created_at: string
          document_id: string | null
          extraction_confidence: number | null
          id: string
          kpi_name: string
          kpi_type: string
          kpi_unit: string | null
          kpi_value: number | null
          period_end: string | null
          period_start: string | null
          property_name: string | null
          raw_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id?: string | null
          extraction_confidence?: number | null
          id?: string
          kpi_name: string
          kpi_type: string
          kpi_unit?: string | null
          kpi_value?: number | null
          period_end?: string | null
          period_start?: string | null
          property_name?: string | null
          raw_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string | null
          extraction_confidence?: number | null
          id?: string
          kpi_name?: string
          kpi_type?: string
          kpi_unit?: string | null
          kpi_value?: number | null
          period_end?: string | null
          period_start?: string | null
          property_name?: string | null
          raw_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "extracted_kpis_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_updates: {
        Row: {
          alert_level: string | null
          change_percentage: number | null
          created_at: string | null
          current_value: number | null
          id: string
          kpi_type: string
          previous_value: number | null
          property_id: string | null
          user_id: string | null
        }
        Insert: {
          alert_level?: string | null
          change_percentage?: number | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          kpi_type: string
          previous_value?: number | null
          property_id?: string | null
          user_id?: string | null
        }
        Update: {
          alert_level?: string | null
          change_percentage?: number | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          kpi_type?: string
          previous_value?: number | null
          property_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_updates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "user_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          created_at: string | null
          id: string
          metric_name: string
          metric_value: number
          period_end: string
          period_start: string
          property_id: string | null
          target_value: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_name: string
          metric_value: number
          period_end: string
          period_start: string
          property_id?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_name?: string
          metric_value?: number
          period_end?: string
          period_start?: string
          property_id?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_data: {
        Row: {
          company_name: string | null
          created_at: string | null
          data_source: string | null
          discount: number | null
          id: string
          payment_completed: boolean | null
          role: string | null
          setup_completed: boolean | null
          total_cost: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          data_source?: string | null
          discount?: number | null
          id?: string
          payment_completed?: boolean | null
          role?: string | null
          setup_completed?: boolean | null
          total_cost?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          data_source?: string | null
          discount?: number | null
          id?: string
          payment_completed?: boolean | null
          role?: string | null
          setup_completed?: boolean | null
          total_cost?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pm_integrations: {
        Row: {
          api_endpoint: string | null
          created_at: string
          credentials_encrypted: string | null
          error_log: string | null
          id: string
          integration_name: string
          last_sync: string | null
          pm_software: string
          settings: Json | null
          sync_frequency: string
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string
          credentials_encrypted?: string | null
          error_log?: string | null
          id?: string
          integration_name: string
          last_sync?: string | null
          pm_software: string
          settings?: Json | null
          sync_frequency?: string
          sync_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string
          credentials_encrypted?: string | null
          error_log?: string | null
          id?: string
          integration_name?: string
          last_sync?: string | null
          pm_software?: string
          settings?: Json | null
          sync_frequency?: string
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      processing_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          job_status: string
          job_type: string
          payload: Json
          priority: number
          result: Json | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_status?: string
          job_type: string
          payload?: Json
          priority?: number
          result?: Json | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_status?: string
          job_type?: string
          payload?: Json
          priority?: number
          result?: Json | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          acquisition_date: string | null
          acquisition_price: number | null
          address: string
          created_at: string | null
          current_value: number | null
          id: string
          name: string
          owner_id: string | null
          property_manager_id: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          square_feet: number | null
          units: number | null
          updated_at: string | null
        }
        Insert: {
          acquisition_date?: string | null
          acquisition_price?: number | null
          address: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          name: string
          owner_id?: string | null
          property_manager_id?: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          square_feet?: number | null
          units?: number | null
          updated_at?: string | null
        }
        Update: {
          acquisition_date?: string | null
          acquisition_price?: number | null
          address?: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          name?: string
          owner_id?: string | null
          property_manager_id?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          square_feet?: number | null
          units?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_manager_id_fkey"
            columns: ["property_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string | null
          error_message: string | null
          id: string
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_layout_settings: {
        Row: {
          card_layout: string | null
          compact_view: boolean | null
          created_at: string | null
          custom_settings: Json | null
          device_type: string
          font_size: string | null
          id: string
          last_used: string | null
          layout_density: string | null
          screen_height: number | null
          screen_width: number | null
          sidebar_collapsed: boolean | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          card_layout?: string | null
          compact_view?: boolean | null
          created_at?: string | null
          custom_settings?: Json | null
          device_type?: string
          font_size?: string | null
          id?: string
          last_used?: string | null
          layout_density?: string | null
          screen_height?: number | null
          screen_width?: number | null
          sidebar_collapsed?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          card_layout?: string | null
          compact_view?: boolean | null
          created_at?: string | null
          custom_settings?: Json | null
          device_type?: string
          font_size?: string | null
          id?: string
          last_used?: string | null
          layout_density?: string | null
          screen_height?: number | null
          screen_width?: number | null
          sidebar_collapsed?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          dashboard_settings: Json | null
          id: string
          preferences: Json | null
          saved_filters: Json | null
          saved_views: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dashboard_settings?: Json | null
          id?: string
          preferences?: Json | null
          saved_filters?: Json | null
          saved_views?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dashboard_settings?: Json | null
          id?: string
          preferences?: Json | null
          saved_filters?: Json | null
          saved_views?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_properties: {
        Row: {
          address: string
          created_at: string | null
          id: string
          monthly_cost: number | null
          name: string
          payment_method: string | null
          pm_software: string | null
          tier: string
          units: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          monthly_cost?: number | null
          name: string
          payment_method?: string | null
          pm_software?: string | null
          tier: string
          units: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          monthly_cost?: number | null
          name?: string
          payment_method?: string | null
          pm_software?: string | null
          tier?: string
          units?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_severity: "low" | "medium" | "high" | "critical"
      alert_status: "active" | "acknowledged" | "resolved" | "dismissed"
      property_type:
        | "multifamily"
        | "office"
        | "retail"
        | "industrial"
        | "mixed_use"
        | "other"
      user_role:
        | "owner"
        | "property_manager"
        | "limited_partner"
        | "analyst"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["low", "medium", "high", "critical"],
      alert_status: ["active", "acknowledged", "resolved", "dismissed"],
      property_type: [
        "multifamily",
        "office",
        "retail",
        "industrial",
        "mixed_use",
        "other",
      ],
      user_role: [
        "owner",
        "property_manager",
        "limited_partner",
        "analyst",
        "admin",
      ],
    },
  },
} as const
