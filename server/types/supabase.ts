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
          monitor_id: string;
          created_at: string;
          width: number;
          height: number;
          url: string;
          interval_cron: string;
          wait_for: string;
          name: string;
        };
        Insert: {
          monitor_id?: string;
          created_at?: string;
          width: number;
          height: number;
          url: string;
          interval_cron: string;
          wait_for: string;
          name: string;
        };
        Update: {
          monitor_id?: string;
          created_at?: string;
          width?: number;
          height?: number;
          url?: string;
          interval_cron?: string;
          wait_for?: string;
          name?: string;
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
