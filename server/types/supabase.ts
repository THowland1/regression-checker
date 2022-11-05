export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      monitor: {
        Row: {
          monitorid: string
          created_at: string
          width: number
          height: number
          url: string
          interval_cron: string
          wait_for: string
          name: string
        }
        Insert: {
          monitorid?: string
          created_at?: string
          width: number
          height: number
          url: string
          interval_cron: string
          wait_for: string
          name: string
        }
        Update: {
          monitorid?: string
          created_at?: string
          width?: number
          height?: number
          url?: string
          interval_cron?: string
          wait_for?: string
          name?: string
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
