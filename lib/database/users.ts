import { createClientComponentClient } from "@/lib/supabase/client"

export interface Patient {
  id: string
  user_id: string
  date_of_birth?: string
  gender?: string
  contact_number?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_number?: string
  medical_history?: string
  allergies?: string
  current_medications?: string
  blood_type?: string
  height?: number
  weight?: number
  insurance_provider?: string
  insurance_policy_number?: string
  preferred_language?: string
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  user_id: string
  full_name: string
  email: string
  specialty: string
  sub_specialty?: string
  license_number: string
  phone?: string
  hospital_affiliation?: string
  years_experience?: number
  medical_school?: string
  graduation_year?: number
  residency_hospital?: string
  residency_year?: number
  fellowship_program?: string
  fellowship_year?: number
  current_hospital?: string
  current_position?: string
  consultation_fee?: number
  available_days?: string[]
  available_hours?: any
  bio?: string
  languages?: string[]
  rating?: number
  total_reviews?: number
  total_patients?: number
  avatar_url?: string
  is_active: boolean
  is_verified: boolean
  verification_status: string
  verification_documents?: any
  created_at: string
  updated_at: string
}

// Safe Supabase client that works during build time
function getSafeSupabaseClient() {
  if (typeof window === "undefined") {
    return null
  }
  return createClientComponentClient()
}

// Patient functions
export async function createPatientProfile(userId: string, patientData: Partial<Patient>) {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return { data: null, error: { message: "Client not available" } }

    const { data, error } = await supabase
      .from("patients")
      .insert({
        user_id: userId,
        ...patientData,
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error("Error creating patient profile:", error)
    return { data: null, error }
  }
}

export async function getPatientProfile(userId: string) {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return { data: null, error: null }

    const { data, error } = await supabase.from("patients").select("*").eq("user_id", userId).single()

    return { data, error }
  } catch (error) {
    console.error("Error fetching patient profile:", error)
    return { data: null, error }
  }
}

export async function updatePatientProfile(userId: string, updates: Partial<Patient>) {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return { data: null, error: { message: "Client not available" } }

    const { data, error } = await supabase
      .from("patients")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error("Error updating patient profile:", error)
    return { data: null, error }
  }
}

// Doctor functions
export async function createDoctorProfile(userId: string, doctorData: Partial<Doctor>) {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return { data: null, error: { message: "Client not available" } }

    const { data, error } = await supabase
      .from("doctors")
      .insert({
        user_id: userId,
        is_active: false,
        is_verified: false,
        verification_status: "pending",
        ...doctorData,
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error("Error creating doctor profile:", error)
    return { data: null, error }
  }
}

export async function getDoctorProfile(userId: string) {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return { data: null, error: null }

    const { data, error } = await supabase.from("doctors").select("*").eq("user_id", userId).single()

    return { data, error }
  } catch (error) {
    console.error("Error fetching doctor profile:", error)
    return { data: null, error }
  }
}

export async function updateDoctorProfile(userId: string, updates: Partial<Doctor>) {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return { data: null, error: { message: "Client not available" } }

    const { data, error } = await supabase
      .from("doctors")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error("Error updating doctor profile:", error)
    return { data: null, error }
  }
}

export async function getAllVerifiedDoctors() {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return { data: [], error: null }

    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("is_verified", true)
      .eq("is_active", true)
      .order("rating", { ascending: false })

    return { data: data || [], error }
  } catch (error) {
    console.error("Error fetching verified doctors:", error)
    return { data: [], error }
  }
}

export async function getDoctorsBySpecialty(specialty: string) {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return { data: [], error: null }

    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("specialty", specialty)
      .eq("is_verified", true)
      .eq("is_active", true)
      .order("rating", { ascending: false })

    return { data: data || [], error }
  } catch (error) {
    console.error("Error fetching doctors by specialty:", error)
    return { data: [], error }
  }
}

// User type detection
export async function getUserType(userId: string) {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return { userType: null, profile: null, error: null }

    // Check if user is a doctor
    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (doctorData && !doctorError) {
      return { userType: "doctor", profile: doctorData, error: null }
    }

    // Check if user is a patient
    const { data: patientData, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (patientData && !patientError) {
      return { userType: "patient", profile: patientData, error: null }
    }

    return { userType: null, profile: null, error: null }
  } catch (error) {
    console.error("Error determining user type:", error)
    return { userType: null, profile: null, error }
  }
}
