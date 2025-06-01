import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    // Authenticate user
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
    }

    // Get signals for this user in this room
    const { data: signals, error: signalsError } = await supabase
      .from("rtc_signals")
      .select("*")
      .eq("room_id", roomId)
      .eq("processed", false)
      .or(`target_id.is.null,target_id.eq.${user.id}`)
      .order("created_at", { ascending: true })

    if (signalsError) {
      console.error("Error fetching signals:", signalsError)
      return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 })
    }

    // Mark signals as processed
    if (signals.length > 0) {
      const signalIds = signals.map((s) => s.id)
      await supabase.from("rtc_signals").update({ processed: true }).in("id", signalIds)
    }

    return NextResponse.json({
      success: true,
      signals,
    })
  } catch (error) {
    console.error("Error getting signals:", error)
    return NextResponse.json({ error: "Failed to get signals" }, { status: 500 })
  }
}
