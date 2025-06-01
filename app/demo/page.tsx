"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, User, ArrowLeft, Send, Heart, Brain, Activity, Thermometer, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [demoStarted, setDemoStarted] = useState(false)

  const healthCategories = [
    {
      icon: Heart,
      title: "Heart Health",
      description: "What are some signs of good cardiovascular health?",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: Brain,
      title: "Mental Wellness",
      description: "How can I improve my mental health and reduce stress?",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Activity,
      title: "Exercise Tips",
      description: "What's a good exercise routine for beginners?",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Thermometer,
      title: "Symptoms",
      description: "I have a headache and feel tired. What could this mean?",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ]

  // Demo responses for different categories
  const demoResponses: { [key: string]: string } = {
    "Heart Health": `**Signs of Good Cardiovascular Health:**

🫀 **Physical Indicators:**
• Resting heart rate: 60-100 beats per minute
• Blood pressure: Less than 120/80 mmHg
• Good exercise tolerance without chest pain
• Quick recovery after physical activity

💪 **Daily Life Signs:**
• Climbing stairs without getting winded
• Sleeping well without breathing issues
• Good energy levels throughout the day
• No swelling in legs or ankles

🩺 **Key Health Markers:**
• Healthy cholesterol levels (LDL <100, HDL >40/50)
• Normal blood sugar levels
• Healthy weight and waist circumference
• No family history of early heart disease

**Tips for Heart Health:**
• Regular exercise (150 minutes/week)
• Eat heart-healthy foods (fish, vegetables, whole grains)
• Manage stress effectively
• Don't smoke and limit alcohol
• Get regular check-ups

Remember to consult your doctor for personalized advice!`,

    "Mental Wellness": `**Improving Mental Health & Reducing Stress:**

🧠 **Daily Mental Health Practices:**
• Practice mindfulness or meditation (10-15 minutes daily)
• Maintain a regular sleep schedule (7-9 hours)
• Stay physically active - exercise boosts mood
• Connect with friends and family regularly

😌 **Stress Management Techniques:**
• Deep breathing exercises
• Progressive muscle relaxation
• Journaling your thoughts and feelings
• Time management and setting boundaries

🌱 **Lifestyle Changes:**
• Limit caffeine and alcohol
• Eat a balanced diet rich in omega-3s
• Spend time in nature
• Practice gratitude daily
• Engage in hobbies you enjoy

🤝 **When to Seek Help:**
• Persistent sadness or anxiety
• Changes in sleep or appetite
• Difficulty concentrating
• Thoughts of self-harm

**Filipino Mental Health Resources:**
• National Center for Mental Health: (02) 531-9001
• Crisis hotline: 0917-899-8727 (USAP)

Your mental health matters - don't hesitate to reach out for support!`,

    "Exercise Tips": `**Beginner Exercise Routine:**

🏃‍♀️ **Week 1-2: Getting Started**
• 20-30 minutes of walking daily
• Basic bodyweight exercises (squats, push-ups, planks)
• 2-3 days per week
• Focus on proper form over intensity

💪 **Week 3-4: Building Strength**
• Add light weights or resistance bands
• Increase walking to 30-40 minutes
• Include stretching and flexibility work
• 3-4 days per week

🎯 **Sample Weekly Schedule:**
• Monday: 30-min walk + bodyweight exercises
• Tuesday: Rest or gentle stretching
• Wednesday: Strength training (light weights)
• Thursday: 30-min walk
• Friday: Full body workout
• Weekend: Active recovery (yoga, swimming)

⚠️ **Safety Tips:**
• Start slowly and gradually increase intensity
• Stay hydrated before, during, and after exercise
• Listen to your body - rest when needed
• Warm up before and cool down after workouts

**Filipino-Friendly Activities:**
• Zumba or dance fitness
• Basketball or volleyball
• Swimming
• Hiking (if accessible)
• Home workouts with online videos

Consistency is key - even 15 minutes daily makes a difference!`,

    Symptoms: `**Headache + Fatigue Analysis:**

🤔 **Possible Common Causes:**
• Dehydration - not drinking enough water
• Poor sleep quality or insufficient sleep
• Stress and tension
• Eye strain from screens
• Skipping meals or low blood sugar
• Caffeine withdrawal

💧 **Immediate Relief Steps:**
• Drink plenty of water
• Rest in a quiet, dark room
• Apply cold or warm compress to head/neck
• Gentle neck and shoulder stretches
• Eat a light, nutritious snack

⚠️ **When to See a Doctor:**
• Severe, sudden headache unlike any before
• Headache with fever, stiff neck, or rash
• Headache after head injury
• Vision changes or confusion
• Headaches becoming more frequent/severe
• Fatigue lasting more than 2 weeks

🏥 **Seek Emergency Care If:**
• Sudden, severe "thunderclap" headache
• Headache with high fever (>38.5°C)
• Difficulty speaking or weakness
• Severe nausea and vomiting

**Prevention Tips:**
• Maintain regular sleep schedule
• Stay hydrated (8-10 glasses water daily)
• Manage stress levels
• Take regular breaks from screens
• Eat regular, balanced meals

This is general information - always consult a healthcare professional for persistent symptoms!`,
  }

  const handleCategoryClick = async (category: string, description: string) => {
    setIsLoading(true)
    setDemoStarted(true)

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: description,
    }
    setMessages([userMessage])

    // Simulate AI thinking time
    setTimeout(() => {
      const response =
        demoResponses[category] ||
        `Thank you for asking about ${category}. This is a demo response showing how our AI assistant would provide detailed, helpful information about your health concerns.`

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setDemoStarted(true)

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Thank you for your question: "${userMessage.content}"

This is a demo version of EveryHealthPH AI Assistant. In the full version, I would provide comprehensive, personalized health guidance based on the latest medical knowledge.

**To access the complete AI assistant with:**
• Personalized health advice
• 24/7 availability  
• Integration with your health records
• Appointment booking
• Medication reminders

Please sign up for your free account!

⚠️ Remember: Always consult healthcare professionals for medical advice.`,
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">EveryHealthPH</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Demo
              </Badge>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col h-[calc(100vh-80px)]">
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto py-8">
            {!demoStarted ? (
              /* Welcome Screen */
              <div className="text-center max-w-2xl mx-auto">
                {/* Bot Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Bot className="h-8 w-8 text-white" />
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl font-semibold text-gray-900 mb-4">How can I help you today?</h1>

                <p className="text-gray-600 mb-12 text-lg">
                  Ask me about your health, symptoms, wellness tips, or any medical questions you have.
                </p>

                {/* Health Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {healthCategories.map((category, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
                      onClick={() => handleCategoryClick(category.title, category.description)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                          >
                            <category.icon className={`h-5 w-5 ${category.color}`} />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-900 mb-2">{category.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="space-y-6 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start space-x-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gradient-to-br from-blue-500 to-green-500 text-white"
                        }`}
                      >
                        {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </div>
                      <div
                        className={`rounded-2xl p-4 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md p-4">
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
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 py-4">
            <form onSubmit={handleFormSubmit} className="flex space-x-3 max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message EveryHealthPH..."
                className="flex-1 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="sm"
                className="h-12 px-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
