import { createClient } from "@/lib/supabase/client"

export interface HealthMetric {
  id: string
  user_id: string
  metric_type: string
  value: number
  unit: string
  recorded_at: string
  notes?: string
}

export interface Medication {
  id: string
  user_id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  start_date: string
  end_date?: string
  instructions?: string
  is_active: boolean
}

export async function getUserHealthMetrics(userId: string, metricType?: string) {
  const supabase = createClient()
  let query = supabase
    .from("health_metrics")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })

  if (metricType) {
    query = query.eq("metric_type", metricType)
  }

  const { data, error } = await query
  if (error) throw error
  return data as HealthMetric[]
}

export async function addHealthMetric(metric: Omit<HealthMetric, "id">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("health_metrics").insert(metric).select().single()

  if (error) throw error
  return data as HealthMetric
}

export async function getUserMedications(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Medication[]
}

export async function addMedication(medication: Omit<Medication, "id">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("medications").insert(medication).select().single()

  if (error) throw error
  return data as Medication
}
