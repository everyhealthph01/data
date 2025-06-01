"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Stethoscope, Send, Bot, User, ArrowLeft, Sparkles, MessageCircle, Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  getUserConversations,
  createConversation,
  getConversationMessages,
  saveMessage,
  type ChatConversation,
} from "@/lib/database/chat"

export const dynamic = "force-dynamic"

export default function ChatPage() {
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    onFinish: async (message) => {
      if (currentConversation) {
        await saveMessage(currentConversation.id, "assistant", message.content)
      }
    },
  })

  useEffect(() => {
    const loadData = async () => {
      // Only run on client side
      if (typeof window === "undefined") return

      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser(user)
          const conversationsData = await getUserConversations(user.id)
          setConversations(conversationsData)

          if (conversationsData.length > 0) {
            await loadConversation(conversationsData[0])
          }
        }
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load chat data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const loadConversation = async (conversation: ChatConversation) => {
    try {
      setCurrentConversation(conversation)
      const messagesData = await getConversationMessages(conversation.id)
      setMessages(
        messagesData.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      )
    } catch (err) {
      console.error("Error loading conversation:", err)
      setError("Failed to load conversation")
    }
  }

  const createNewConversation = async () => {
    if (!user || typeof window === "undefined") return

    try {
      const title = `Chat ${new Date().toLocaleDateString()}`
      const newConversation = await createConversation(user.id, title)
      setConversations([newConversation, ...conversations])
      setCurrentConversation(newConversation)
      setMessages([])
    } catch (err) {
      console.error("Error creating conversation:", err)
      setError("Failed to create new conversation")
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentConversation && user) {
      // Create new conversation if none exists
      await createNewConversation()
    }

    if (currentConversation) {
      // Save user message to database
      await saveMessage(currentConversation.id, "user", input)
    }

    handleSubmit(e)
  }

  const suggestedQuestions = [
    "What are the symptoms of dengue fever?",
    "How can I manage my diabetes better?",
    "What should I do if I have a persistent cough?",
    "Can you help me understand my medication schedule?",
    "What are some healthy Filipino foods for heart health?",
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">AI Health Assistant</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={createNewConversation} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              <Badge className="bg-green-100 text-green-700 border-green-200">Online</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => loadConversation(conversation)}
                      className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                        currentConversation?.id === conversation.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                      }`}
                    >
                      <p className="font-medium text-sm truncate">{conversation.title}</p>
                      <p className="text-xs text-gray-500">{new Date(conversation.updated_at).toLocaleDateString()}</p>
                    </button>
                  ))}
                  {conversations.length === 0 && (
                    <p className="text-gray-500 text-center py-8 text-sm">No conversations yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-100 bg-white/50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">EveryHealthPH AI Assistant</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Get instant health guidance and support. Remember, this is for informational purposes only.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {error && (
                  <Alert variant="destructive" className="m-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Bot className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to your AI Health Assistant!</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        I'm here to help answer your health questions and provide guidance. How can I assist you today?
                      </p>

                      <div className="space-y-4 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <p className="text-sm font-medium text-gray-700">Try asking:</p>
                        </div>
                        <div className="grid gap-3">
                          {suggestedQuestions.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="text-left justify-start h-auto p-4 text-sm bg-white/80 hover:bg-white hover:shadow-md transition-all duration-200 border-gray-200"
                              onClick={() => {
                                const syntheticEvent = {
                                  preventDefault: () => {},
                                  target: { value: question },
                                } as any
                                handleInputChange(syntheticEvent)
                                setTimeout(() => {
                                  const submitEvent = { preventDefault: () => {} } as any
                                  handleChatSubmit(submitEvent)
                                }, 100)
                              }}
                            >
                              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                              </div>
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                              : "bg-gradient-to-br from-green-500 to-green-600 text-white"
                          }`}
                        >
                          {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                        </div>
                        <div
                          className={`rounded-2xl p-4 shadow-sm ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                              : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-[85%]">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-100 p-6 bg-white/50">
                  <form onSubmit={handleChatSubmit} className="flex space-x-3">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask me about your health concerns..."
                      className="flex-1 h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="h-12 px-6 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-xl shadow-lg"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    ⚠️ This AI assistant provides general information only. Always consult healthcare professionals for
                    medical advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
