export interface User {
  id: string
  email: string
  full_name?: string
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  user_id: string
  first_name: string
  last_name: string
  specialty: string
  license_number: string
  is_verified: boolean
  is_active: boolean
  verification_status: "pending" | "approved" | "rejected"
  consultation_fee?: number
  bio?: string
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  user_id: string
  date_of_birth?: string
  gender?: string
  contact_number?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_number?: string
  blood_type?: string
  allergies?: string
  medical_history?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  consultation_type: "video" | "chat" | "in_person"
  notes?: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  message_type: "text" | "image" | "file"
  is_read: boolean
  created_at: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      SUPABASE_SERVICE_ROLE_KEY: string
    }
  }
}
