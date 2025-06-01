import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    // Authenticate user
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { roomId, appointmentId } = await req.json()

    if (!roomId || !appointmentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update room status
    await supabase.from("video_rooms").update({ status: "ended" }).eq("room_id", roomId)

    // Update appointment status
    await supabase
      .from("appointments")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", appointmentId)

    // Generate consultation summary
    const summary = {
      duration: Math.floor(Math.random() * 20) + 10, // Random duration between 10-30 minutes
      keyPoints: [
        "Discussed current symptoms and treatment progress",
        "Reviewed medication schedule and dosage",
        "Recommended lifestyle adjustments",
        "Scheduled follow-up appointment",
      ],
      recommendations: [
        "Continue current medication as prescribed",
        "Increase daily water intake to 2 liters",
        "Monitor blood pressure daily",
        "Follow up in 2 weeks",
      ],
    }

    return NextResponse.json({
      success: true,
      summary,
    })
  } catch (error) {
    console.error("Error ending call:", error)
    return NextResponse.json({ error: "Failed to end call" }, { status: 500 })
  }
}
