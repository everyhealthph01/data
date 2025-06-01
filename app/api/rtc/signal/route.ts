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
    const { roomId, signal, targetUserId } = await req.json()

    if (!roomId || !signal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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

    // Check if user is allowed to signal in this room
    const isParticipant = room.participants.some((p: any) => p.id === user.id)
    if (!isParticipant) {
      return NextResponse.json({ error: "You are not authorized to signal in this room" }, { status: 403 })
    }

    // Store the signal in the database
    const { data: signalData, error: signalError } = await supabase
      .from("rtc_signals")
      .insert({
        room_id: roomId,
        sender_id: user.id,
        target_id: targetUserId || null, // If null, it's a broadcast
        signal_data: signal,
        processed: false,
      })
      .select()
      .single()

    if (signalError) {
      console.error("Error storing signal:", signalError)
      return NextResponse.json({ error: "Failed to store signal" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      signal: signalData,
    })
  } catch (error) {
    console.error("Error processing signal:", error)
    return NextResponse.json({ error: "Failed to process signal" }, { status: 500 })
  }
}
