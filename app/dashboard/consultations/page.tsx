"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Video,
  Mic,
  MessageCircle,
  ArrowLeft,
  Camera,
  Settings,
  FileText,
  Heart,
  AlertTriangle,
  Monitor,
  Smartphone,
  Wifi,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getUserAppointments, type Appointment } from "@/lib/database/appointments"

// Force dynamic rendering to prevent prerendering issues
export const dynamic = "force-dynamic"

export default function ConsultationsPage() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user data and appointments
  useEffect(() => {
    const loadData = async () => {
      try {
        // Only run on client side
        if (typeof window === "undefined") {
          return
        }

        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser(user)
          const appointmentsData = await getUserAppointments(user.id)
          setAppointments(appointmentsData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load consultation data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const upcomingConsultations = appointments.filter(
    (apt) => apt.type === "virtual" && ["pending", "confirmed"].includes(apt.status),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-semibold text-slate-900">Virtual Consultations</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Virtual Consultation System Info Card */}
        <Card className="mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Virtual Consultation System</CardTitle>
                <CardDescription className="text-slate-600">
                  Connect with your doctor through secure, high-quality video calls
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <p className="font-medium">Before joining a consultation:</p>
                <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                  <li>Ensure your camera and microphone are working</li>
                  <li>Use a stable internet connection</li>
                  <li>Find a quiet, well-lit environment</li>
                  <li>Close other applications that might use your camera or microphone</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Features */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Features</h3>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-6">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                        <Video className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-slate-700">HD video conferencing</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <Mic className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-slate-700">Clear audio with noise suppression</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-slate-700">In-meeting chat for sharing information</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                        <Settings className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-slate-700">Easy-to-use controls and settings</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* System Requirements */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">System Requirements</h3>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                        <Monitor className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <span className="text-slate-700 font-medium">Supported browsers:</span>
                        <p className="text-sm text-slate-600 mt-1">Chrome, Firefox, Safari, Edge</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                        <Smartphone className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <span className="text-slate-700 font-medium">Mobile devices:</span>
                        <p className="text-sm text-slate-600 mt-1">iOS and Android with WebRTC support</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                        <Wifi className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <span className="text-slate-700 font-medium">Internet connection:</span>
                        <p className="text-sm text-slate-600 mt-1">Minimum 1 Mbps upload/download</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Consultations Info */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Virtual Consultation Information</h2>
          </div>

          {upcomingConsultations.length > 0 ? (
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Virtual Consultations Available</h3>
                  <p className="text-slate-600 mb-6">
                    You have {upcomingConsultations.length} upcoming virtual consultation
                    {upcomingConsultations.length > 1 ? "s" : ""} scheduled.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6 mb-6">
                    <h4 className="font-medium text-slate-900 mb-4">Your Scheduled Consultations:</h4>
                    <div className="space-y-3">
                      {upcomingConsultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                        >
                          <div className="text-left">
                            <p className="font-medium text-slate-900">
                              {consultation.doctor?.full_name || "Dr. Unknown"}
                            </p>
                            <p className="text-sm text-slate-600">
                              {consultation.doctor?.specialty || "General Medicine"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900">{consultation.appointment_date}</p>
                            <p className="text-sm text-slate-600">{consultation.appointment_time.slice(0, 5)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">
                    Virtual consultations will be available closer to your appointment time.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent>
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Virtual Consultations Scheduled</h3>
                <p className="text-gray-600 mb-6">
                  Book an appointment with one of our doctors and select "Virtual Consultation" to get started.
                </p>
                <Link href="/dashboard/appointments">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Book Virtual Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* How It Works */}
        <Card className="mt-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">How Virtual Consultations Work</CardTitle>
                <CardDescription className="text-slate-600">
                  Simple steps to connect with your healthcare provider
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-slate-900 mb-2">Book Appointment</h4>
                <p className="text-sm text-slate-600">
                  Schedule a virtual consultation with your preferred doctor through our booking system.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-slate-900 mb-2">Prepare Your Setup</h4>
                <p className="text-sm text-slate-600">
                  Test your camera and microphone, find a quiet space, and ensure stable internet.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-slate-900 mb-2">Join Your Consultation</h4>
                <p className="text-sm text-slate-600">
                  Click the join button when your appointment time arrives and connect with your doctor.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
