import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

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
    const { appointmentId } = await req.json()

    if (!appointmentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select(`
        *,
        doctor:doctors(*)
      `)
      .eq("id", appointmentId)
      .single()

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Create a unique room ID
    const roomId = uuidv4()

    // Create a room in the database
    const { data: room, error: roomError } = await supabase
      .from("video_rooms")
      .insert({
        room_id: roomId,
        appointment_id: appointmentId,
        created_by: user.id,
        status: "active",
        participants: [
          {
            id: user.id,
            role: "patient",
            joined_at: new Date().toISOString(),
          },
          {
            id: appointment.doctor_id,
            role: "doctor",
            joined_at: null,
          },
        ],
      })
      .select()
      .single()

    if (roomError) {
      console.error("Error creating room:", roomError)
      return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
    }

    // Update appointment with room ID
    await supabase
      .from("appointments")
      .update({
        room_id: roomId,
        status: "in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId)

    return NextResponse.json({
      success: true,
      room: {
        id: roomId,
        appointment: appointment,
      },
    })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
