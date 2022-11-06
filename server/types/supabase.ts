export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      monitor: {
        Row: {
          created_at: string;
          width: number;
          height: number;
          url: string;
          interval_cron: string;
          wait_for: string;
          name: string;
          monitor_id: string;
        };
        Insert: {
          created_at?: string;
          width: number;
          height: number;
          url: string;
          interval_cron: string;
          wait_for: string;
          name: string;
          monitor_id?: string;
        };
        Update: {
          created_at?: string;
          width?: number;
          height?: number;
          url?: string;
          interval_cron?: string;
          wait_for?: string;
          name?: string;
          monitor_id?: string;
        };
      };
      snapshot: {
        Row: {
          snapshot_id: string;
          created_at: string;
          monitor_id: string;
          image_url: string;
          diff_image_url: string;
          diff_pixel_count: number;
          small_image_url: string;
          medium_image_url: string;
        };
        Insert: {
          snapshot_id?: string;
          created_at?: string;
          monitor_id: string;
          image_url: string;
          diff_image_url: string;
          diff_pixel_count: number;
          small_image_url: string;
          medium_image_url: string;
        };
        Update: {
          snapshot_id?: string;
          created_at?: string;
          monitor_id?: string;
          image_url?: string;
          diff_image_url?: string;
          diff_pixel_count?: number;
          small_image_url?: string;
          medium_image_url?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
