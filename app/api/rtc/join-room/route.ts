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
    const { roomId } = await req.json()

    if (!roomId) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
    }

    // Get room details
    const { data: room, error: roomError } = await supabase
      .from("video_rooms")
      .select("*")
      .eq("room_id", roomId)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Check if user is allowed to join this room
    const isParticipant = room.participants.some((p: any) => p.id === user.id)
    if (!isParticipant) {
      return NextResponse.json({ error: "You are not authorized to join this room" }, { status: 403 })
    }

    // Update participant status
    const updatedParticipants = room.participants.map((p: any) => {
      if (p.id === user.id) {
        return {
          ...p,
          joined_at: new Date().toISOString(),
        }
      }
      return p
    })

    // Update room with new participant status
    await supabase
      .from("video_rooms")
      .update({
        participants: updatedParticipants,
        updated_at: new Date().toISOString(),
      })
      .eq("room_id", roomId)

    // Get appointment details
    const { data: appointment } = await supabase
      .from("appointments")
      .select(`
        *,
        doctor:doctors(*)
      `)
      .eq("id", room.appointment_id)
      .single()

    // Get user details
    const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

    return NextResponse.json({
      success: true,
      room: {
        ...room,
        participants: updatedParticipants,
      },
      user: {
        id: user.id,
        name: userData?.full_name || user.email,
        role: room.participants.find((p: any) => p.id === user.id)?.role || "patient",
      },
      appointment,
    })
  } catch (error) {
    console.error("Error joining room:", error)
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 })
  }
}
