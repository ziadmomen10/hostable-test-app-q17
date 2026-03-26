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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          title: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          title: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_config: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          message: string
          text_color: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          message: string
          text_color?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string
          text_color?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      banned_ips: {
        Row: {
          banned_by_user_id: string
          created_at: string
          id: string
          ip_address: unknown
          reason: string | null
          updated_at: string
        }
        Insert: {
          banned_by_user_id: string
          created_at?: string
          id?: string
          ip_address: unknown
          reason?: string | null
          updated_at?: string
        }
        Update: {
          banned_by_user_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      currencies: {
        Row: {
          code: string
          created_at: string
          exchange_rate: number | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          rate_updated_at: string | null
          symbol: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          exchange_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          rate_updated_at?: string | null
          symbol: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          exchange_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          rate_updated_at?: string | null
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          job_post_id: string
          phone: string | null
          resume_url: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          job_post_id: string
          phone?: string | null
          resume_url?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          job_post_id?: string
          phone?: string | null
          resume_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posts: {
        Row: {
          about_the_role: string
          apply_external_url: string | null
          apply_type: string
          commitment_custom: string | null
          commitment_type: string
          created_at: string
          department_id: string
          id: string
          is_active: boolean
          key_responsibilities: string
          location_country: string | null
          location_type: string
          nice_to_have: string | null
          requirements: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
          what_we_offer: string | null
        }
        Insert: {
          about_the_role?: string
          apply_external_url?: string | null
          apply_type?: string
          commitment_custom?: string | null
          commitment_type?: string
          created_at?: string
          department_id: string
          id?: string
          is_active?: boolean
          key_responsibilities?: string
          location_country?: string | null
          location_type?: string
          nice_to_have?: string | null
          requirements?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          what_we_offer?: string | null
        }
        Update: {
          about_the_role?: string
          apply_external_url?: string | null
          apply_type?: string
          commitment_custom?: string | null
          commitment_type?: string
          created_at?: string
          department_id?: string
          id?: string
          is_active?: boolean
          key_responsibilities?: string
          location_country?: string | null
          location_type?: string
          nice_to_have?: string | null
          requirements?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          what_we_offer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          created_at: string
          direction: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          native_name: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          direction?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          native_name?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          direction?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          native_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      namespaces: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          created_at: string
          description_key: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          monthly_discounted_price: number | null
          monthly_price: number
          name_key: string
          sort_order: number | null
          updated_at: string
          yearly_discounted_price: number | null
          yearly_price: number
        }
        Insert: {
          created_at?: string
          description_key?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          monthly_discounted_price?: number | null
          monthly_price?: number
          name_key: string
          sort_order?: number | null
          updated_at?: string
          yearly_discounted_price?: number | null
          yearly_price?: number
        }
        Update: {
          created_at?: string
          description_key?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          monthly_discounted_price?: number | null
          monthly_price?: number
          name_key?: string
          sort_order?: number | null
          updated_at?: string
          yearly_discounted_price?: number | null
          yearly_price?: number
        }
        Relationships: []
      }
      page_locks: {
        Row: {
          expires_at: string
          id: string
          locked_at: string
          locked_by: string
          locked_by_username: string | null
          page_id: string
        }
        Insert: {
          expires_at?: string
          id?: string
          locked_at?: string
          locked_by: string
          locked_by_username?: string | null
          page_id: string
        }
        Update: {
          expires_at?: string
          id?: string
          locked_at?: string
          locked_by?: string
          locked_by_username?: string | null
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_locks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_seo: {
        Row: {
          aeo_score: number | null
          canonical_url: string | null
          created_at: string
          focus_keyword: string | null
          geo_score: number | null
          id: string
          language_code: string
          meta_description: string | null
          meta_title: string | null
          no_follow: boolean | null
          no_index: boolean | null
          og_description: string | null
          og_image_url: string | null
          og_title: string | null
          og_type: string | null
          page_id: string
          secondary_keywords: string[] | null
          seo_analysis: Json | null
          seo_issues: Json | null
          seo_score: number | null
          structured_data: Json | null
          twitter_card: string | null
          twitter_description: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          aeo_score?: number | null
          canonical_url?: string | null
          created_at?: string
          focus_keyword?: string | null
          geo_score?: number | null
          id?: string
          language_code?: string
          meta_description?: string | null
          meta_title?: string | null
          no_follow?: boolean | null
          no_index?: boolean | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          og_type?: string | null
          page_id: string
          secondary_keywords?: string[] | null
          seo_analysis?: Json | null
          seo_issues?: Json | null
          seo_score?: number | null
          structured_data?: Json | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          aeo_score?: number | null
          canonical_url?: string | null
          created_at?: string
          focus_keyword?: string | null
          geo_score?: number | null
          id?: string
          language_code?: string
          meta_description?: string | null
          meta_title?: string | null
          no_follow?: boolean | null
          no_index?: boolean | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          og_type?: string | null
          page_id?: string
          secondary_keywords?: string[] | null
          seo_analysis?: Json | null
          seo_issues?: Json | null
          seo_score?: number | null
          structured_data?: Json | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_page_seo_page"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_seo_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_translation_coverage: {
        Row: {
          coverage_percentage: number
          created_at: string | null
          id: string
          language_code: string
          language_name: string
          last_calculated_at: string | null
          page_id: string
          total_keys: number
          translated_count: number
          updated_at: string | null
        }
        Insert: {
          coverage_percentage?: number
          created_at?: string | null
          id?: string
          language_code: string
          language_name: string
          last_calculated_at?: string | null
          page_id: string
          total_keys?: number
          translated_count?: number
          updated_at?: string | null
        }
        Update: {
          coverage_percentage?: number
          created_at?: string | null
          id?: string
          language_code?: string
          language_name?: string
          last_calculated_at?: string | null
          page_id?: string
          total_keys?: number
          translated_count?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_page_translation_coverage_page"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_translation_coverage_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_translations: {
        Row: {
          content: string
          created_at: string | null
          element_key: string
          id: string
          language_id: string
          page_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          element_key: string
          id?: string
          language_id: string
          page_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          element_key?: string
          id?: string
          language_id?: string
          page_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "translation_coverage_stats"
            referencedColumns: ["language_id"]
          },
          {
            foreignKeyName: "page_translations_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_versions: {
        Row: {
          change_summary: string | null
          content: string | null
          created_at: string
          created_by: string | null
          css_content: string | null
          id: string
          metadata: Json | null
          page_description: string | null
          page_id: string
          page_title: string | null
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          css_content?: string | null
          id?: string
          metadata?: Json | null
          page_description?: string | null
          page_id: string
          page_title?: string | null
          version_number: number
        }
        Update: {
          change_summary?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          css_content?: string | null
          id?: string
          metadata?: Json | null
          page_description?: string | null
          page_id?: string
          page_title?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_page_versions_page"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          blog_tags: string | null
          cloned_from_id: string | null
          content: string | null
          country: string | null
          created_at: string
          css_content: string | null
          default_currency: string | null
          elements_with_keys: number | null
          header_image_url: string | null
          hidden_sections: string[] | null
          id: string
          is_active: boolean | null
          keys_coverage_percentage: number | null
          og_image_url: string | null
          overall_coverage: number | null
          page_description: string | null
          page_keywords: string | null
          page_title: string
          page_url: string
          show_price_switcher: boolean | null
          supported_languages: string[] | null
          total_translatable_elements: number | null
          updated_at: string
          version: number
        }
        Insert: {
          blog_tags?: string | null
          cloned_from_id?: string | null
          content?: string | null
          country?: string | null
          created_at?: string
          css_content?: string | null
          default_currency?: string | null
          elements_with_keys?: number | null
          header_image_url?: string | null
          hidden_sections?: string[] | null
          id?: string
          is_active?: boolean | null
          keys_coverage_percentage?: number | null
          og_image_url?: string | null
          overall_coverage?: number | null
          page_description?: string | null
          page_keywords?: string | null
          page_title: string
          page_url: string
          show_price_switcher?: boolean | null
          supported_languages?: string[] | null
          total_translatable_elements?: number | null
          updated_at?: string
          version?: number
        }
        Update: {
          blog_tags?: string | null
          cloned_from_id?: string | null
          content?: string | null
          country?: string | null
          created_at?: string
          css_content?: string | null
          default_currency?: string | null
          elements_with_keys?: number | null
          header_image_url?: string | null
          hidden_sections?: string[] | null
          id?: string
          is_active?: boolean | null
          keys_coverage_percentage?: number | null
          og_image_url?: string | null
          overall_coverage?: number | null
          page_description?: string | null
          page_keywords?: string | null
          page_title?: string
          page_url?: string
          show_price_switcher?: boolean | null
          supported_languages?: string[] | null
          total_translatable_elements?: number | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "pages_cloned_from_id_fkey"
            columns: ["cloned_from_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          gender: string | null
          id: string
          last_login: string | null
          must_change_password: boolean
          password_hash: string
          profile_picture_url: string | null
          roles: string[] | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          last_login?: string | null
          must_change_password?: boolean
          password_hash?: string
          profile_picture_url?: string | null
          roles?: string[] | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          last_login?: string | null
          must_change_password?: boolean
          password_hash?: string
          profile_picture_url?: string | null
          roles?: string[] | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string
          created_by: string | null
          from_path: string
          hit_count: number
          id: string
          is_active: boolean
          last_hit_at: string | null
          notes: string | null
          redirect_type: number
          to_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          from_path: string
          hit_count?: number
          id?: string
          is_active?: boolean
          last_hit_at?: string | null
          notes?: string | null
          redirect_type?: number
          to_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          from_path?: string
          hit_count?: number
          id?: string
          is_active?: boolean
          last_hit_at?: string | null
          notes?: string | null
          redirect_type?: number
          to_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_definitions: {
        Row: {
          created_at: string | null
          description: string | null
          grants_admin_access: boolean | null
          id: string
          is_active: boolean | null
          label: string
          role_key: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          grants_admin_access?: boolean | null
          id?: string
          is_active?: boolean | null
          label: string
          role_key: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          grants_admin_access?: boolean | null
          id?: string
          is_active?: boolean | null
          label?: string
          role_key?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_analytics_data: {
        Row: {
          avg_session_duration: number | null
          bounce_rate: number | null
          created_at: string | null
          date: string | null
          id: string
          medium: string | null
          page_id: string | null
          page_path: string
          pageviews: number | null
          sessions: number | null
          traffic_source: string | null
          users: number | null
        }
        Insert: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          medium?: string | null
          page_id?: string | null
          page_path: string
          pageviews?: number | null
          sessions?: number | null
          traffic_source?: string | null
          users?: number | null
        }
        Update: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          medium?: string | null
          page_id?: string | null
          page_path?: string
          pageviews?: number | null
          sessions?: number | null
          traffic_source?: string | null
          users?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_analytics_data_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_backlink_data: {
        Row: {
          anchor_text: string | null
          created_at: string | null
          domain_rating: number | null
          first_seen_at: string | null
          id: string
          is_dofollow: boolean | null
          last_checked_at: string | null
          link_type: string | null
          page_id: string | null
          provider: string | null
          source_url: string
          target_url: string
          url_rating: number | null
        }
        Insert: {
          anchor_text?: string | null
          created_at?: string | null
          domain_rating?: number | null
          first_seen_at?: string | null
          id?: string
          is_dofollow?: boolean | null
          last_checked_at?: string | null
          link_type?: string | null
          page_id?: string | null
          provider?: string | null
          source_url: string
          target_url: string
          url_rating?: number | null
        }
        Update: {
          anchor_text?: string | null
          created_at?: string | null
          domain_rating?: number | null
          first_seen_at?: string | null
          id?: string
          is_dofollow?: boolean | null
          last_checked_at?: string | null
          link_type?: string | null
          page_id?: string | null
          provider?: string | null
          source_url?: string
          target_url?: string
          url_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_backlink_data_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_cluster_pages: {
        Row: {
          cluster_id: string
          created_at: string
          id: string
          link_strength: number | null
          page_id: string
          relationship_type: string | null
        }
        Insert: {
          cluster_id: string
          created_at?: string
          id?: string
          link_strength?: number | null
          page_id: string
          relationship_type?: string | null
        }
        Update: {
          cluster_id?: string
          created_at?: string
          id?: string
          link_strength?: number | null
          page_id?: string
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_cluster_pages_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "seo_topic_clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_cluster_pages_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_content_briefs: {
        Row: {
          competitor_insights: Json | null
          created_at: string
          focus_keyword: string | null
          heading_structure: Json | null
          id: string
          language_code: string
          page_id: string | null
          questions_to_answer: Json | null
          semantic_keywords: Json | null
          target_word_count: number | null
          updated_at: string
        }
        Insert: {
          competitor_insights?: Json | null
          created_at?: string
          focus_keyword?: string | null
          heading_structure?: Json | null
          id?: string
          language_code?: string
          page_id?: string | null
          questions_to_answer?: Json | null
          semantic_keywords?: Json | null
          target_word_count?: number | null
          updated_at?: string
        }
        Update: {
          competitor_insights?: Json | null
          created_at?: string
          focus_keyword?: string | null
          heading_structure?: Json | null
          id?: string
          language_code?: string
          page_id?: string | null
          questions_to_answer?: Json | null
          semantic_keywords?: Json | null
          target_word_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_content_briefs_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_content_freshness: {
        Row: {
          checked_at: string | null
          content_hash: string | null
          decay_detected_at: string | null
          freshness_score: number | null
          id: string
          last_major_update: string | null
          page_id: string
          refresh_suggestions: Json | null
          word_count: number | null
        }
        Insert: {
          checked_at?: string | null
          content_hash?: string | null
          decay_detected_at?: string | null
          freshness_score?: number | null
          id?: string
          last_major_update?: string | null
          page_id: string
          refresh_suggestions?: Json | null
          word_count?: number | null
        }
        Update: {
          checked_at?: string | null
          content_hash?: string | null
          decay_detected_at?: string | null
          freshness_score?: number | null
          id?: string
          last_major_update?: string | null
          page_id?: string
          refresh_suggestions?: Json | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_content_freshness_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_gsc_data: {
        Row: {
          clicks: number | null
          country: string | null
          created_at: string | null
          ctr: number | null
          date: string | null
          device: string | null
          id: string
          impressions: number | null
          indexed_status: string | null
          last_crawled_at: string | null
          page_id: string | null
          page_url: string
          position: number | null
          query: string | null
        }
        Insert: {
          clicks?: number | null
          country?: string | null
          created_at?: string | null
          ctr?: number | null
          date?: string | null
          device?: string | null
          id?: string
          impressions?: number | null
          indexed_status?: string | null
          last_crawled_at?: string | null
          page_id?: string | null
          page_url: string
          position?: number | null
          query?: string | null
        }
        Update: {
          clicks?: number | null
          country?: string | null
          created_at?: string | null
          ctr?: number | null
          date?: string | null
          device?: string | null
          id?: string
          impressions?: number | null
          indexed_status?: string | null
          last_crawled_at?: string | null
          page_id?: string | null
          page_url?: string
          position?: number | null
          query?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_gsc_data_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_history: {
        Row: {
          change_type: string
          changed_by: string | null
          created_at: string | null
          field_name: string | null
          id: string
          language_code: string
          new_value: string | null
          old_value: string | null
          page_id: string | null
        }
        Insert: {
          change_type: string
          changed_by?: string | null
          created_at?: string | null
          field_name?: string | null
          id?: string
          language_code?: string
          new_value?: string | null
          old_value?: string | null
          page_id?: string | null
        }
        Update: {
          change_type?: string
          changed_by?: string | null
          created_at?: string | null
          field_name?: string | null
          id?: string
          language_code?: string
          new_value?: string | null
          old_value?: string | null
          page_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_history_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_integrations: {
        Row: {
          config: Json | null
          created_at: string | null
          error_message: string | null
          id: string
          integration_type: string
          is_connected: boolean | null
          last_sync_at: string | null
          page_id: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          integration_type: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          page_id?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          integration_type?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          page_id?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_integrations_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_keyword_ranks: {
        Row: {
          checked_at: string | null
          created_at: string | null
          id: string
          keyword: string
          page_id: string | null
          position: number | null
          previous_position: number | null
          search_engine: string | null
        }
        Insert: {
          checked_at?: string | null
          created_at?: string | null
          id?: string
          keyword: string
          page_id?: string | null
          position?: number | null
          previous_position?: number | null
          search_engine?: string | null
        }
        Update: {
          checked_at?: string | null
          created_at?: string | null
          id?: string
          keyword?: string
          page_id?: string | null
          position?: number | null
          previous_position?: number | null
          search_engine?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_keyword_ranks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_schema_validation: {
        Row: {
          created_at: string | null
          errors: Json | null
          id: string
          is_valid: boolean | null
          page_id: string | null
          page_url: string
          rich_results_eligible: Json | null
          schema_types: Json | null
          validated_at: string | null
          warnings: Json | null
        }
        Insert: {
          created_at?: string | null
          errors?: Json | null
          id?: string
          is_valid?: boolean | null
          page_id?: string | null
          page_url: string
          rich_results_eligible?: Json | null
          schema_types?: Json | null
          validated_at?: string | null
          warnings?: Json | null
        }
        Update: {
          created_at?: string | null
          errors?: Json | null
          id?: string
          is_valid?: boolean | null
          page_id?: string | null
          page_url?: string
          rich_results_eligible?: Json | null
          schema_types?: Json | null
          validated_at?: string | null
          warnings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_schema_validation_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_score_history: {
        Row: {
          aeo_score: number | null
          combined_score: number | null
          created_at: string
          geo_score: number | null
          id: string
          issues_count: number | null
          language_code: string
          metadata: Json | null
          page_id: string
          seo_score: number | null
          snapshot_date: string
        }
        Insert: {
          aeo_score?: number | null
          combined_score?: number | null
          created_at?: string
          geo_score?: number | null
          id?: string
          issues_count?: number | null
          language_code?: string
          metadata?: Json | null
          page_id: string
          seo_score?: number | null
          snapshot_date: string
        }
        Update: {
          aeo_score?: number | null
          combined_score?: number | null
          created_at?: string
          geo_score?: number | null
          id?: string
          issues_count?: number | null
          language_code?: string
          metadata?: Json | null
          page_id?: string
          seo_score?: number | null
          snapshot_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_score_history_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_tasks: {
        Row: {
          auto_generated: boolean | null
          category: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          impact_score: number | null
          is_completed: boolean | null
          language_code: string
          page_id: string
          priority: string | null
          task_description: string | null
          task_title: string
          task_type: string
        }
        Insert: {
          auto_generated?: boolean | null
          category?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          impact_score?: number | null
          is_completed?: boolean | null
          language_code?: string
          page_id: string
          priority?: string | null
          task_description?: string | null
          task_title: string
          task_type: string
        }
        Update: {
          auto_generated?: boolean | null
          category?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          impact_score?: number | null
          is_completed?: boolean | null
          language_code?: string
          page_id?: string
          priority?: string | null
          task_description?: string | null
          task_title?: string
          task_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_tasks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_topic_clusters: {
        Row: {
          cluster_description: string | null
          cluster_name: string
          color: string | null
          created_at: string
          id: string
          pillar_page_id: string | null
          updated_at: string
        }
        Insert: {
          cluster_description?: string | null
          cluster_name: string
          color?: string | null
          created_at?: string
          id?: string
          pillar_page_id?: string | null
          updated_at?: string
        }
        Update: {
          cluster_description?: string | null
          cluster_name?: string
          color?: string | null
          created_at?: string
          id?: string
          pillar_page_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_topic_clusters_pillar_page_id_fkey"
            columns: ["pillar_page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_test: {
        Row: {
          created_at: string | null
          id: string
          test_message: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          test_message: string
        }
        Update: {
          created_at?: string | null
          id?: string
          test_message?: string
        }
        Relationships: []
      }
      translation_history: {
        Row: {
          change_type: string
          changed_by: string | null
          created_at: string
          id: string
          key: string
          language_id: string
          namespace: string
          new_value: string | null
          old_value: string | null
          translation_id: string
        }
        Insert: {
          change_type: string
          changed_by?: string | null
          created_at?: string
          id?: string
          key: string
          language_id: string
          namespace: string
          new_value?: string | null
          old_value?: string | null
          translation_id: string
        }
        Update: {
          change_type?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          key?: string
          language_id?: string
          namespace?: string
          new_value?: string | null
          old_value?: string | null
          translation_id?: string
        }
        Relationships: []
      }
      translation_keys: {
        Row: {
          context: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          key: string
          page_id: string | null
          prop_path: string | null
          section_id: string | null
          section_type: string | null
          source_language: string
          source_text: string
          updated_at: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          page_id?: string | null
          prop_path?: string | null
          section_id?: string | null
          section_type?: string | null
          source_language?: string
          source_text: string
          updated_at?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          page_id?: string | null
          prop_path?: string | null
          section_id?: string | null
          section_type?: string | null
          source_language?: string
          source_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_translation_keys_page"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translation_keys_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          ai_provider: string | null
          ai_translated_at: string | null
          approved_at: string | null
          approved_by: string | null
          context: string | null
          created_at: string
          id: string
          key: string
          language_id: string
          manually_edited_at: string | null
          namespace: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_language: string | null
          source_text: string | null
          status: string | null
          updated_at: string
          value: string | null
          version: number | null
        }
        Insert: {
          ai_provider?: string | null
          ai_translated_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          context?: string | null
          created_at?: string
          id?: string
          key: string
          language_id: string
          manually_edited_at?: string | null
          namespace?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_language?: string | null
          source_text?: string | null
          status?: string | null
          updated_at?: string
          value?: string | null
          version?: number | null
        }
        Update: {
          ai_provider?: string | null
          ai_translated_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          context?: string | null
          created_at?: string
          id?: string
          key?: string
          language_id?: string
          manually_edited_at?: string | null
          namespace?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_language?: string | null
          source_text?: string | null
          status?: string | null
          updated_at?: string
          value?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_translations_language"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_translations_language"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "translation_coverage_stats"
            referencedColumns: ["language_id"]
          },
          {
            foreignKeyName: "translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "translation_coverage_stats"
            referencedColumns: ["language_id"]
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
    }
    Views: {
      translation_coverage_stats: {
        Row: {
          ai_translated_count: number | null
          coverage_percentage: number | null
          edited_count: number | null
          language_code: string | null
          language_id: string | null
          language_name: string | null
          page_id: string | null
          page_title: string | null
          page_url: string | null
          reviewed_count: number | null
          total_keys: number | null
          translated_keys: number | null
          untranslated_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_translation_keys_page"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translation_keys_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      acquire_page_lock: {
        Args: { p_page_id: string; p_user_id: string; p_username: string }
        Returns: {
          locked_at: string
          locked_by_username: string
          success: boolean
        }[]
      }
      check_user_is_admin: { Args: { check_user_id: string }; Returns: boolean }
      create_page_version: {
        Args: { p_change_summary?: string; p_page_id: string }
        Returns: string
      }
      get_missing_translations: {
        Args: { p_language_code: string; p_page_id: string }
        Returns: {
          key: string
          prop_path: string
          section_id: string
          section_type: string
          source_text: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_authenticated_admin: { Args: never; Returns: boolean }
      is_current_user_admin: { Args: never; Returns: boolean }
      is_user_admin: { Args: { _user_id: string }; Returns: boolean }
      release_page_lock: {
        Args: { p_page_id: string; p_user_id: string }
        Returns: undefined
      }
      validate_page_translations: {
        Args: { p_page_id: string }
        Returns: {
          error_count: number
          errors: Json
          is_valid: boolean
          warning_count: number
          warnings: Json
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user" | "seo_manager" | "content_writer" | "manager"
      translation_status:
        | "untranslated"
        | "ai_translated"
        | "reviewed"
        | "edited"
      user_role: "admin" | "user" | "seo_manager" | "content_writer" | "manager"
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
      app_role: ["admin", "user", "seo_manager", "content_writer", "manager"],
      translation_status: [
        "untranslated",
        "ai_translated",
        "reviewed",
        "edited",
      ],
      user_role: ["admin", "user", "seo_manager", "content_writer", "manager"],
    },
  },
} as const
