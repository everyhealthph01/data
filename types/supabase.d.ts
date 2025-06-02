export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          doctor_id: string
          start_time: string
          end_time: string
          status: string
          notes: string | null
          type: string
          meeting_link: string | null
          meeting_id: string | null
          meeting_password: string | null
          reason: string | null
          symptoms: string[] | null
          follow_up: boolean
          previous_appointment_id: string | null
          canceled_by: string | null
          canceled_reason: string | null
          canceled_at: string | null
          rescheduled: boolean
          rescheduled_from: string | null
          payment_status: string | null
          payment_amount: number | null
          payment_id: string | null
          rating: number | null
          review: string | null
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          doctor_id: string
          start_time: string
          end_time: string
          status?: string
          notes?: string | null
          type: string
          meeting_link?: string | null
          meeting_id?: string | null
          meeting_password?: string | null
          reason?: string | null
          symptoms?: string[] | null
          follow_up?: boolean
          previous_appointment_id?: string | null
          canceled_by?: string | null
          canceled_reason?: string | null
          canceled_at?: string | null
          rescheduled?: boolean
          rescheduled_from?: string | null
          payment_status?: string | null
          payment_amount?: number | null
          payment_id?: string | null
          rating?: number | null
          review?: string | null
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          doctor_id?: string
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          type?: string
          meeting_link?: string | null
          meeting_id?: string | null
          meeting_password?: string | null
          reason?: string | null
          symptoms?: string[] | null
          follow_up?: boolean
          previous_appointment_id?: string | null
          canceled_by?: string | null
          canceled_reason?: string | null
          canceled_at?: string | null
          rescheduled?: boolean
          rescheduled_from?: string | null
          payment_status?: string | null
          payment_amount?: number | null
          payment_id?: string | null
          rating?: number | null
          review?: string | null
          reviewed_at?: string | null
        }
      }
      doctors: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          specialty: string
          license_number: string
          education: Json[]
          experience: Json[]
          bio: string | null
          profile_image: string | null
          consultation_fee: number | null
          available_hours: Json | null
          languages: string[]
          is_verified: boolean
          is_active: boolean
          verification_status: string
          verification_date: string | null
          verification_notes: string | null
          verification_documents: Json[] | null
          rating: number | null
          total_reviews: number | null
          total_patients: number | null
          total_consultations: number | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          specialty: string
          license_number: string
          education: Json[]
          experience: Json[]
          bio?: string | null
          profile_image?: string | null
          consultation_fee?: number | null
          available_hours?: Json | null
          languages: string[]
          is_verified?: boolean
          is_active?: boolean
          verification_status?: string
          verification_date?: string | null
          verification_notes?: string | null
          verification_documents?: Json[] | null
          rating?: number | null
          total_reviews?: number | null
          total_patients?: number | null
          total_consultations?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          specialty?: string
          license_number?: string
          education?: Json[]
          experience?: Json[]
          bio?: string | null
          profile_image?: string | null
          consultation_fee?: number | null
          available_hours?: Json | null
          languages?: string[]
          is_verified?: boolean
          is_active?: boolean
          verification_status?: string
          verification_date?: string | null
          verification_notes?: string | null
          verification_documents?: Json[] | null
          rating?: number | null
          total_reviews?: number | null
          total_patients?: number | null
          total_consultations?: number | null
        }
      }
      patients: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          date_of_birth: string | null
          gender: string | null
          blood_type: string | null
          height: number | null
          weight: number | null
          allergies: string[] | null
          medical_conditions: string[] | null
          medications: string[] | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          profile_image: string | null
          medical_history: Json[] | null
          insurance_provider: string | null
          insurance_policy_number: string | null
          primary_doctor_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          date_of_birth?: string | null
          gender?: string | null
          blood_type?: string | null
          height?: number | null
          weight?: number | null
          allergies?: string[] | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          profile_image?: string | null
          medical_history?: Json[] | null
          insurance_provider?: string | null
          insurance_policy_number?: string | null
          primary_doctor_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          date_of_birth?: string | null
          gender?: string | null
          blood_type?: string | null
          height?: number | null
          weight?: number | null
          allergies?: string[] | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          profile_image?: string | null
          medical_history?: Json[] | null
          insurance_provider?: string | null
          insurance_policy_number?: string | null
          primary_doctor_id?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
