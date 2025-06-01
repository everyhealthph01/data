import { createClient } from "@/lib/supabase/client"

export interface ChatConversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

export async function getUserConversations(userId: string) {
  // Only run on client side
  if (typeof window === "undefined") {
    return []
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data as ChatConversation[]
  } catch (error) {
    console.error("Error getting conversations:", error)
    return []
  }
}

export async function createConversation(userId: string, title: string) {
  if (typeof window === "undefined") {
    throw new Error("This function can only be called on the client side")
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({ user_id: userId, title })
      .select()
      .single()

    if (error) throw error
    return data as ChatConversation
  } catch (error) {
    console.error("Error creating conversation:", error)
    throw error
  }
}

export async function getConversationMessages(conversationId: string) {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data as ChatMessage[]
  } catch (error) {
    console.error("Error getting messages:", error)
    return []
  }
}

export async function saveMessage(conversationId: string, role: "user" | "assistant", content: string) {
  if (typeof window === "undefined") {
    throw new Error("This function can only be called on the client side")
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ conversation_id: conversationId, role, content })
      .select()
      .single()

    if (error) throw error
    return data as ChatMessage
  } catch (error) {
    console.error("Error saving message:", error)
    throw error
  }
}
