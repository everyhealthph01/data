import { createClientComponentClient } from "@/lib/supabase/client"

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
  new_patients_this_month?: number
  avg_consultation_minutes?: number
  avg_consultation_change?: number
  avatar_url?: string
  is_active: boolean
  is_verified: boolean
  verification_status: string
  verification_documents?: any
  created_at?: string
  updated_at?: string
}

export interface Appointment {
  id: string
  user_id: string
  doctor_id: string
  doctor?: Doctor
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  type: "virtual" | "in_person"
  status: "pending" | "confirmed" | "completed" | "cancelled"
  reason?: string
  notes?: string
  consultation_fee?: number
  payment_status: "pending" | "paid" | "refunded"
  meeting_link?: string | null
  room_id?: string | null
  created_at?: string
  updated_at?: string
}

// Helper function to safely create Supabase client
function getSafeSupabaseClient() {
  if (typeof window === "undefined") {
    return null
  }
  return createClientComponentClient()
}

// Get all doctors (with optional filtering)
export async function getDoctors(specialty?: string): Promise<Doctor[]> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return []

    let query = supabase.from("doctors").select("*").eq("is_verified", true).eq("is_active", true)

    if (specialty) {
      query = query.eq("specialty", specialty)
    }

    const { data, error } = await query.order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching doctors:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getDoctors:", error)
    return []
  }
}

// Get a specific doctor by ID
export async function getDoctorById(doctorId: string): Promise<Doctor | null> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase.from("doctors").select("*").eq("id", doctorId).single()

    if (error) {
      console.error("Error fetching doctor:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getDoctorById:", error)
    return null
  }
}

// Get doctors by specialty
export async function getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("specialty", specialty)
      .eq("is_verified", true)
      .eq("is_active", true)
      .order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching doctors by specialty:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getDoctorsBySpecialty:", error)
    return []
  }
}

// Get appointments for a specific user
export async function getUserAppointments(userId: string): Promise<Appointment[]> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        doctor:doctor_id (*)
      `)
      .eq("user_id", userId)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })

    if (error) {
      console.error("Error fetching appointments:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserAppointments:", error)
    return []
  }
}

// Get upcoming appointments for a patient
export async function getUpcomingPatientAppointments(userId: string): Promise<Appointment[]> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return []

    const today = new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        doctor:doctors(id, full_name, specialty, avatar_url)
      `)
      .eq("user_id", userId)
      .gte("appointment_date", today)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })

    if (error) {
      console.error("Error fetching upcoming patient appointments:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUpcomingPatientAppointments:", error)
    return []
  }
}

// Get today's appointments for a patient
export async function getTodayPatientAppointments(userId: string): Promise<Appointment[]> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return []

    const today = new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        doctor:doctors(id, full_name, specialty, avatar_url)
      `)
      .eq("user_id", userId)
      .eq("appointment_date", today)
      .order("appointment_time", { ascending: true })

    if (error) {
      console.error("Error fetching today's patient appointments:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getTodayPatientAppointments:", error)
    return []
  }
}

// Get appointment statistics for a patient
export async function getPatientAppointmentStats(userId: string) {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      }
    }

    const { data, error } = await supabase.from("appointments").select("status").eq("user_id", userId)

    if (error) {
      console.error("Error fetching appointment stats:", error)
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      }
    }

    const stats = {
      total: data.length,
      pending: data.filter((apt) => apt.status === "pending").length,
      confirmed: data.filter((apt) => apt.status === "confirmed").length,
      completed: data.filter((apt) => apt.status === "completed").length,
      cancelled: data.filter((apt) => apt.status === "cancelled").length,
    }

    return stats
  } catch (error) {
    console.error("Error in getPatientAppointmentStats:", error)
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    }
  }
}

// Get appointments for a doctor
export async function getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:auth.users!appointments_user_id_fkey(id, email, raw_user_meta_data)
      `)
      .eq("doctor_id", doctorId)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })

    if (error) {
      console.error("Error fetching doctor appointments:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getDoctorAppointments:", error)
    return []
  }
}

// Get upcoming appointments for a doctor
export async function getUpcomingDoctorAppointments(doctorId: string): Promise<Appointment[]> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return []

    const today = new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:auth.users!appointments_user_id_fkey(id, email, raw_user_meta_data)
      `)
      .eq("doctor_id", doctorId)
      .gte("appointment_date", today)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })

    if (error) {
      console.error("Error fetching upcoming doctor appointments:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUpcomingDoctorAppointments:", error)
    return []
  }
}

// Create a new appointment
export async function createAppointment(
  appointmentData: Omit<Appointment, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { success: false, error: "Cannot run on server" }
    }

    const { error } = await supabase.from("appointments").insert(appointmentData)

    if (error) {
      console.error("Error creating appointment:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in createAppointment:", error)
    return { success: false, error }
  }
}

// Update an appointment
export async function updateAppointment(
  appointmentId: string,
  updates: Partial<Appointment>,
): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { success: false, error: "Cannot run on server" }
    }

    const { error } = await supabase.from("appointments").update(updates).eq("id", appointmentId)

    if (error) {
      console.error("Error updating appointment:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateAppointment:", error)
    return { success: false, error }
  }
}

// Update appointment status
export async function updateAppointmentStatus(
  appointmentId: string,
  status: string,
  notes?: string,
): Promise<Appointment | null> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return null

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (notes) {
      updateData.notes = notes
    }

    const { data, error } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", appointmentId)
      .select(`
        *,
        doctor:doctors(id, full_name, specialty, avatar_url)
      `)
      .single()

    if (error) {
      console.error("Error updating appointment status:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateAppointmentStatus:", error)
    return null
  }
}

// Get appointment by ID
export async function getAppointmentById(appointmentId: string): Promise<Appointment | null> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        doctor:doctors(id, full_name, specialty, avatar_url),
        patient:auth.users!appointments_user_id_fkey(id, email, raw_user_meta_data)
      `)
      .eq("id", appointmentId)
      .single()

    if (error) {
      console.error("Error fetching appointment by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getAppointmentById:", error)
    return null
  }
}

// Cancel an appointment
export async function cancelAppointment(appointmentId: string): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = getSafeSupabaseClient()
    if (!supabase) {
      return { success: false, error: "Cannot run on server" }
    }

    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", appointmentId)

    if (error) {
      console.error("Error cancelling appointment:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in cancelAppointment:", error)
    return { success: false, error }
  }
}
