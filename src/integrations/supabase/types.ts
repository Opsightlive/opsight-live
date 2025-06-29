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
      alert_instances: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_level: string
          alert_message: string
          alert_rule_id: string | null
          created_at: string
          id: string
          kpi_type: string
          kpi_value: number | null
          notification_sent: Json | null
          property_id: string | null
          property_name: string | null
          resolved_at: string | null
          status: string
          trigger_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_level: string
          alert_message: string
          alert_rule_id?: string | null
          created_at?: string
          id?: string
          kpi_type: string
          kpi_value?: number | null
          notification_sent?: Json | null
          property_id?: string | null
          property_name?: string | null
          resolved_at?: string | null
          status?: string
          trigger_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_level?: string
          alert_message?: string
          alert_rule_id?: string | null
          created_at?: string
          id?: string
          kpi_type?: string
          kpi_value?: number | null
          notification_sent?: Json | null
          property_id?: string | null
          property_name?: string | null
          resolved_at?: string | null
          status?: string
          trigger_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_instances_alert_rule_id_fkey"
            columns: ["alert_rule_id"]
            isOneToOne: false
            referencedRelation: "alert_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_processing_log: {
        Row: {
          alerts_triggered: number | null
          batch_id: string
          completed_at: string | null
          error_message: string | null
          id: string
          notifications_sent: number | null
          processing_time_ms: number | null
          processing_type: string
          properties_processed: number | null
          started_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          alerts_triggered?: number | null
          batch_id?: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          notifications_sent?: number | null
          processing_time_ms?: number | null
          processing_type: string
          properties_processed?: number | null
          started_at?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          alerts_triggered?: number | null
          batch_id?: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          notifications_sent?: number | null
          processing_time_ms?: number | null
          processing_type?: string
          properties_processed?: number | null
          started_at?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      alert_rules: {
        Row: {
          alert_frequency: string
          conditions: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          kpi_type: string
          notification_channels: string[] | null
          property_ids: string[] | null
          rule_name: string
          threshold_green_max: number | null
          threshold_green_min: number | null
          threshold_red_max: number | null
          threshold_red_min: number | null
          threshold_yellow_max: number | null
          threshold_yellow_min: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_frequency?: string
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          kpi_type: string
          notification_channels?: string[] | null
          property_ids?: string[] | null
          rule_name: string
          threshold_green_max?: number | null
          threshold_green_min?: number | null
          threshold_red_max?: number | null
          threshold_red_min?: number | null
          threshold_yellow_max?: number | null
          threshold_yellow_min?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_frequency?: string
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          kpi_type?: string
          notification_channels?: string[] | null
          property_ids?: string[] | null
          rule_name?: string
          threshold_green_max?: number | null
          threshold_green_min?: number | null
          threshold_red_max?: number | null
          threshold_red_min?: number | null
          threshold_yellow_max?: number | null
          threshold_yellow_min?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      consistency_rules: {
        Row: {
          affected_modules: string[]
          created_at: string
          id: string
          is_enforced: boolean
          rule_definition: Json
          rule_name: string
          rule_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          affected_modules?: string[]
          created_at?: string
          id?: string
          is_enforced?: boolean
          rule_definition: Json
          rule_name: string
          rule_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          affected_modules?: string[]
          created_at?: string
          id?: string
          is_enforced?: boolean
          rule_definition?: Json
          rule_name?: string
          rule_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_integration_sources: {
        Row: {
          api_credentials_encrypted: string | null
          created_at: string
          endpoint_url: string | null
          error_log: string | null
          id: string
          last_sync_at: string | null
          mapping_config: Json | null
          source_name: string
          source_type: string
          sync_frequency: string | null
          sync_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_credentials_encrypted?: string | null
          created_at?: string
          endpoint_url?: string | null
          error_log?: string | null
          id?: string
          last_sync_at?: string | null
          mapping_config?: Json | null
          source_name: string
          source_type: string
          sync_frequency?: string | null
          sync_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_credentials_encrypted?: string | null
          created_at?: string
          endpoint_url?: string | null
          error_log?: string | null
          id?: string
          last_sync_at?: string | null
          mapping_config?: Json | null
          source_name?: string
          source_type?: string
          sync_frequency?: string | null
          sync_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      delivery_logs: {
        Row: {
          alert_instance_id: string | null
          clicked_at: string | null
          created_at: string
          delivery_provider: string | null
          delivery_status: string
          delivery_time: string | null
          error_message: string | null
          id: string
          max_retries: number | null
          message_content: string
          opened_at: string | null
          priority: number | null
          provider_message_id: string | null
          recipient_address: string
          recipient_type: string
          retry_count: number | null
          subject: string | null
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_instance_id?: string | null
          clicked_at?: string | null
          created_at?: string
          delivery_provider?: string | null
          delivery_status?: string
          delivery_time?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          message_content: string
          opened_at?: string | null
          priority?: number | null
          provider_message_id?: string | null
          recipient_address: string
          recipient_type: string
          retry_count?: number | null
          subject?: string | null
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_instance_id?: string | null
          clicked_at?: string | null
          created_at?: string
          delivery_provider?: string | null
          delivery_status?: string
          delivery_time?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          message_content?: string
          opened_at?: string | null
          priority?: number | null
          provider_message_id?: string | null
          recipient_address?: string
          recipient_type?: string
          retry_count?: number | null
          subject?: string | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_logs_alert_instance_id_fkey"
            columns: ["alert_instance_id"]
            isOneToOne: false
            referencedRelation: "alert_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_statistics: {
        Row: {
          channel: string
          click_rate: number | null
          created_at: string
          date: string
          delivery_rate: number | null
          id: string
          open_rate: number | null
          total_clicked: number | null
          total_delivered: number | null
          total_failed: number | null
          total_opened: number | null
          total_sent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel: string
          click_rate?: number | null
          created_at?: string
          date: string
          delivery_rate?: number | null
          id?: string
          open_rate?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          click_rate?: number | null
          created_at?: string
          date?: string
          delivery_rate?: number | null
          id?: string
          open_rate?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      feature_history: {
        Row: {
          change_description: string | null
          change_type: string
          created_at: string
          created_by: string
          feature_name: string
          id: string
          module_name: string
          new_state: Json
          previous_state: Json | null
          user_id: string
        }
        Insert: {
          change_description?: string | null
          change_type: string
          created_at?: string
          created_by: string
          feature_name: string
          id?: string
          module_name: string
          new_state: Json
          previous_state?: Json | null
          user_id: string
        }
        Update: {
          change_description?: string | null
          change_type?: string
          created_at?: string
          created_by?: string
          feature_name?: string
          id?: string
          module_name?: string
          new_state?: Json
          previous_state?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      kpi_aggregations: {
        Row: {
          aggregated_value: number
          aggregation_type: string
          category: string
          created_at: string
          id: string
          metric_name: string
          period_end: string
          period_start: string
          property_count: number | null
          user_id: string
        }
        Insert: {
          aggregated_value: number
          aggregation_type: string
          category: string
          created_at?: string
          id?: string
          metric_name: string
          period_end: string
          period_start: string
          property_count?: number | null
          user_id: string
        }
        Update: {
          aggregated_value?: number
          aggregation_type?: string
          category?: string
          created_at?: string
          id?: string
          metric_name?: string
          period_end?: string
          period_start?: string
          property_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      kpi_events: {
        Row: {
          alert_level: string | null
          category: string
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          metric_name: string
          new_value: number | null
          old_value: number | null
          processed: boolean | null
          property_id: string | null
          user_id: string
        }
        Insert: {
          alert_level?: string | null
          category: string
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          metric_name: string
          new_value?: number | null
          old_value?: number | null
          processed?: boolean | null
          property_id?: string | null
          user_id: string
        }
        Update: {
          alert_level?: string | null
          category?: string
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          metric_name?: string
          new_value?: number | null
          old_value?: number | null
          processed?: boolean | null
          property_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "user_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_metrics: {
        Row: {
          category: string
          change_percentage: number | null
          created_at: string
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          performance_zone: string | null
          period_end: string
          period_start: string
          previous_value: number | null
          property_id: string | null
          target_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          change_percentage?: number | null
          created_at?: string
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          performance_zone?: string | null
          period_end: string
          period_start: string
          previous_value?: number | null
          property_id?: string | null
          target_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          change_percentage?: number | null
          created_at?: string
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          performance_zone?: string | null
          period_end?: string
          period_start?: string
          previous_value?: number | null
          property_id?: string | null
          target_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_metrics_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "user_properties"
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
      lp_report_templates: {
        Row: {
          ai_summary_enabled: boolean | null
          auto_generation_enabled: boolean | null
          chart_configs: Json | null
          created_at: string
          description: string | null
          email_recipients: string[] | null
          generation_schedule: string | null
          id: string
          is_active: boolean | null
          sections: Json
          template_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary_enabled?: boolean | null
          auto_generation_enabled?: boolean | null
          chart_configs?: Json | null
          created_at?: string
          description?: string | null
          email_recipients?: string[] | null
          generation_schedule?: string | null
          id?: string
          is_active?: boolean | null
          sections?: Json
          template_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary_enabled?: boolean | null
          auto_generation_enabled?: boolean | null
          chart_configs?: Json | null
          created_at?: string
          description?: string | null
          email_recipients?: string[] | null
          generation_schedule?: string | null
          id?: string
          is_active?: boolean | null
          sections?: Json
          template_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lp_reports: {
        Row: {
          ai_summary: string | null
          created_at: string
          download_count: number | null
          email_sent_at: string | null
          error_message: string | null
          file_size_bytes: number | null
          generated_at: string | null
          generation_status: string
          id: string
          pdf_storage_path: string | null
          property_ids: string[] | null
          report_data: Json
          report_period_end: string
          report_period_start: string
          report_title: string
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          download_count?: number | null
          email_sent_at?: string | null
          error_message?: string | null
          file_size_bytes?: number | null
          generated_at?: string | null
          generation_status?: string
          id?: string
          pdf_storage_path?: string | null
          property_ids?: string[] | null
          report_data?: Json
          report_period_end: string
          report_period_start: string
          report_title: string
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          download_count?: number | null
          email_sent_at?: string | null
          error_message?: string | null
          file_size_bytes?: number | null
          generated_at?: string | null
          generation_status?: string
          id?: string
          pdf_storage_path?: string | null
          property_ids?: string[] | null
          report_data?: Json
          report_period_end?: string
          report_period_start?: string
          report_title?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lp_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "lp_report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          message_content: string
          subject: string | null
          template_name: string
          template_type: string
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          message_content: string
          subject?: string | null
          template_name: string
          template_type: string
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          message_content?: string
          subject?: string | null
          template_name?: string
          template_type?: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      module_dependencies: {
        Row: {
          created_at: string
          dependency_details: Json
          dependency_type: string
          id: string
          is_critical: boolean
          source_module: string
          target_module: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dependency_details?: Json
          dependency_type: string
          id?: string
          is_critical?: boolean
          source_module: string
          target_module: string
          user_id: string
        }
        Update: {
          created_at?: string
          dependency_details?: Json
          dependency_type?: string
          id?: string
          is_critical?: boolean
          source_module?: string
          target_module?: string
          user_id?: string
        }
        Relationships: []
      }
      module_states: {
        Row: {
          business_logic: Json
          configuration: Json
          created_at: string
          data_schema: Json
          feature_flags: Json
          id: string
          is_active: boolean
          module_name: string
          module_version: string
          ui_layout: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          business_logic?: Json
          configuration?: Json
          created_at?: string
          data_schema?: Json
          feature_flags?: Json
          id?: string
          is_active?: boolean
          module_name: string
          module_version?: string
          ui_layout?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          business_logic?: Json
          configuration?: Json
          created_at?: string
          data_schema?: Json
          feature_flags?: Json
          id?: string
          is_active?: boolean
          module_name?: string
          module_version?: string
          ui_layout?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_queue: {
        Row: {
          alert_instance_id: string | null
          created_at: string
          error_message: string | null
          id: string
          max_retries: number
          message: string
          notification_type: string
          priority: number
          recipient: string
          retry_count: number
          scheduled_for: string
          sent_at: string | null
          status: string
          subject: string | null
          template_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_instance_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          max_retries?: number
          message: string
          notification_type: string
          priority?: number
          recipient: string
          retry_count?: number
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_instance_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          max_retries?: number
          message?: string
          notification_type?: string
          priority?: number
          recipient?: string
          retry_count?: number
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_alert_instance_id_fkey"
            columns: ["alert_instance_id"]
            isOneToOne: false
            referencedRelation: "alert_instances"
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
      report_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          report_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          report_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          report_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_analytics_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "lp_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_generation_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          error_details: Json | null
          id: string
          max_retries: number | null
          priority: number | null
          report_id: string | null
          retry_count: number | null
          scheduled_for: string | null
          started_at: string | null
          status: string
          template_id: string | null
          user_id: string
          worker_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          id?: string
          max_retries?: number | null
          priority?: number | null
          report_id?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          started_at?: string | null
          status?: string
          template_id?: string | null
          user_id: string
          worker_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          id?: string
          max_retries?: number | null
          priority?: number | null
          report_id?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          started_at?: string | null
          status?: string
          template_id?: string | null
          user_id?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_generation_queue_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "lp_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_generation_queue_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "lp_report_templates"
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
      user_notification_preferences: {
        Row: {
          created_at: string
          dashboard_enabled: boolean
          email_address: string | null
          email_enabled: boolean
          emergency_override: boolean
          id: string
          phone_number: string | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          quiet_hours_timezone: string | null
          sms_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_enabled?: boolean
          email_address?: string | null
          email_enabled?: boolean
          emergency_override?: boolean
          id?: string
          phone_number?: string | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          quiet_hours_timezone?: string | null
          sms_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_enabled?: boolean
          email_address?: string | null
          email_enabled?: boolean
          emergency_override?: boolean
          id?: string
          phone_number?: string | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          quiet_hours_timezone?: string | null
          sms_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notification_settings: {
        Row: {
          created_at: string
          default_email_template_id: string | null
          default_sms_template_id: string | null
          enable_delivery_tracking: boolean | null
          id: string
          rate_limit_per_hour: number | null
          sendgrid_api_key_encrypted: string | null
          twilio_account_sid_encrypted: string | null
          twilio_auth_token_encrypted: string | null
          twilio_phone_number: string | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          default_email_template_id?: string | null
          default_sms_template_id?: string | null
          enable_delivery_tracking?: boolean | null
          id?: string
          rate_limit_per_hour?: number | null
          sendgrid_api_key_encrypted?: string | null
          twilio_account_sid_encrypted?: string | null
          twilio_auth_token_encrypted?: string | null
          twilio_phone_number?: string | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          default_email_template_id?: string | null
          default_sms_template_id?: string | null
          enable_delivery_tracking?: boolean | null
          id?: string
          rate_limit_per_hour?: number | null
          sendgrid_api_key_encrypted?: string | null
          twilio_account_sid_encrypted?: string | null
          twilio_auth_token_encrypted?: string | null
          twilio_phone_number?: string | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_settings_default_email_template_id_fkey"
            columns: ["default_email_template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notification_settings_default_sms_template_id_fkey"
            columns: ["default_sms_template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
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
      calculate_performance_zone: {
        Args: {
          current_value: number
          target_value: number
          metric_type?: string
        }
        Returns: string
      }
      cleanup_report_queue: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_report_statistics: {
        Args: { p_user_id: string; p_days?: number }
        Returns: {
          total_reports: number
          completed_reports: number
          failed_reports: number
          avg_generation_time_minutes: number
          total_downloads: number
          total_emails_sent: number
        }[]
      }
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
