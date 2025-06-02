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

// Safe Supabase client with retry logic
function getSafeSupabaseClient() {
  try {
    return createClientComponentClient()
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}

// Retry wrapper for database operations
async function withRetry<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error("Max retries exceeded")
}

// Patient functions with improved error handling
export async function createPatientProfile(userId: string, patientData: Partial<Patient>) {
  try {
    if (!userId) {
      return { data: null, error: { message: "User ID is required" } }
    }

    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { data: null, error: { message: "Database connection not available" } }
    }

    const result = await withRetry(async () => {
      const { data, error } = await supabase
        .from("patients")
        .insert({
          user_id: userId,
          ...patientData,
        })
        .select()
        .single()

      return { data, error }
    })

    return result
  } catch (error) {
    console.error("Error creating patient profile:", error)
    return { data: null, error: error || { message: "Failed to create patient profile" } }
  }
}

export async function getPatientProfile(userId: string) {
  try {
    if (!userId) {
      return { data: null, error: { message: "User ID is required" } }
    }

    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { data: null, error: null }
    }

    const result = await withRetry(async () => {
      const { data, error } = await supabase.from("patients").select("*").eq("user_id", userId).single()

      return { data, error }
    })

    return result
  } catch (error) {
    console.error("Error fetching patient profile:", error)
    return { data: null, error: error || { message: "Failed to fetch patient profile" } }
  }
}

export async function updatePatientProfile(userId: string, updates: Partial<Patient>) {
  try {
    if (!userId) {
      return { data: null, error: { message: "User ID is required" } }
    }

    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { data: null, error: { message: "Database connection not available" } }
    }

    const result = await withRetry(async () => {
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
    })

    return result
  } catch (error) {
    console.error("Error updating patient profile:", error)
    return { data: null, error: error || { message: "Failed to update patient profile" } }
  }
}

// Doctor functions with improved error handling
export async function createDoctorProfile(userId: string, doctorData: Partial<Doctor>) {
  try {
    if (!userId) {
      return { data: null, error: { message: "User ID is required" } }
    }

    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { data: null, error: { message: "Database connection not available" } }
    }

    const result = await withRetry(async () => {
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
    })

    return result
  } catch (error) {
    console.error("Error creating doctor profile:", error)
    return { data: null, error: error || { message: "Failed to create doctor profile" } }
  }
}

export async function getDoctorProfile(userId: string) {
  try {
    if (!userId) {
      return { data: null, error: { message: "User ID is required" } }
    }

    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { data: null, error: null }
    }

    const result = await withRetry(async () => {
      const { data, error } = await supabase.from("doctors").select("*").eq("user_id", userId).single()

      return { data, error }
    })

    return result
  } catch (error) {
    console.error("Error fetching doctor profile:", error)
    return { data: null, error: error || { message: "Failed to fetch doctor profile" } }
  }
}

export async function updateDoctorProfile(userId: string, updates: Partial<Doctor>) {
  try {
    if (!userId) {
      return { data: null, error: { message: "User ID is required" } }
    }

    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { data: null, error: { message: "Database connection not available" } }
    }

    const result = await withRetry(async () => {
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
    })

    return result
  } catch (error) {
    console.error("Error updating doctor profile:", error)
    return { data: null, error: error || { message: "Failed to update doctor profile" } }
  }
}

export async function getAllVerifiedDoctors() {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { data: [], error: null }
    }

    const result = await withRetry(async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("is_verified", true)
        .eq("is_active", true)
        .order("rating", { ascending: false })

      return { data: data || [], error }
    })

    return result
  } catch (error) {
    console.error("Error fetching verified doctors:", error)
    return { data: [], error: error || { message: "Failed to fetch doctors" } }
  }
}

export async function getDoctorsBySpecialty(specialty: string) {
  try {
    if (!specialty) {
      return { data: [], error: { message: "Specialty is required" } }
    }

    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { data: [], error: null }
    }

    const result = await withRetry(async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("specialty", specialty)
        .eq("is_verified", true)
        .eq("is_active", true)
        .order("rating", { ascending: false })

      return { data: data || [], error }
    })

    return result
  } catch (error) {
    console.error("Error fetching doctors by specialty:", error)
    return { data: [], error: error || { message: "Failed to fetch doctors by specialty" } }
  }
}

// User type detection with improved error handling
export async function getUserType(userId: string) {
  try {
    if (!userId) {
      return { userType: null, profile: null, error: { message: "User ID is required" } }
    }

    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { userType: null, profile: null, error: null }
    }

    // Check if user is a doctor first
    try {
      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (doctorData && !doctorError) {
        return { userType: "doctor", profile: doctorData, error: null }
      }
    } catch (error) {
      // Continue to check patient if doctor check fails
    }

    // Check if user is a patient
    try {
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (patientData && !patientError) {
        return { userType: "patient", profile: patientData, error: null }
      }
    } catch (error) {
      // User is neither doctor nor patient
    }

    return { userType: null, profile: null, error: null }
  } catch (error) {
    console.error("Error determining user type:", error)
    return { userType: null, profile: null, error: error || { message: "Failed to determine user type" } }
  }
}
