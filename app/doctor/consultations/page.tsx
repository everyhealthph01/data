"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Video,
  Mic,
  MessageCircle,
  ArrowLeft,
  Camera,
  Settings,
  FileText,
  Stethoscope,
  AlertTriangle,
  Monitor,
  Smartphone,
  Wifi,
  User,
  Calendar,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { getDoctorAppointments, type Appointment } from "@/lib/database/appointments"

// Force dynamic rendering to prevent prerendering issues
export const dynamic = "force-dynamic"

export default function DoctorConsultationsPage() {
  const [user, setUser] = useState<any>(null)
  const [doctorProfile, setDoctorProfile] = useState<any>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Load user data and appointments
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/signin")
          return
        }

        setUser(user)

        // Check if user is a verified doctor
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctors")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (doctorError || !doctorData) {
          router.push("/doctor/register")
          return
        }

        if (!doctorData.is_verified || !doctorData.is_active) {
          router.push("/doctor/pending")
          return
        }

        setDoctorProfile(doctorData)

        // Load doctor's appointments
        const appointmentsData = await getDoctorAppointments(doctorData.id)
        setAppointments(appointmentsData)
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load consultation data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const upcomingConsultations = appointments.filter(
    (apt) => apt.type === "virtual" && ["pending", "confirmed"].includes(apt.status),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Consultations</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/doctor/dashboard">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-semibold text-slate-900">Doctor Portal - Virtual Consultations</span>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Healthcare Provider</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Doctor Virtual Consultation System Info Card */}
        <Card className="mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Doctor Virtual Consultation System</CardTitle>
                <CardDescription className="text-slate-600">
                  Provide secure, professional healthcare consultations through high-quality video calls
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-emerald-50 border-emerald-200">
              <AlertTriangle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800">
                <p className="font-medium">Before starting a consultation:</p>
                <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                  <li>Verify your camera and microphone are functioning properly</li>
                  <li>Ensure stable, high-speed internet connection</li>
                  <li>Use a professional, well-lit environment</li>
                  <li>Have patient records and necessary documentation ready</li>
                  <li>Close unnecessary applications to optimize performance</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Professional Features */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Professional Features</h3>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-6">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mr-3">
                        <Video className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">HD video conferencing with medical-grade quality</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <Mic className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-slate-700">Crystal clear audio with noise cancellation</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-slate-700">Secure chat for sharing medical information</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-slate-700">HIPAA-compliant security and encryption</span>
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
                        <p className="text-sm text-slate-600 mt-1">Chrome, Firefox, Safari, Edge (latest versions)</p>
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
                        <p className="text-sm text-slate-600 mt-1">
                          Minimum 2 Mbps upload/download (5+ Mbps recommended)
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Virtual Consultations */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Today's Virtual Consultations</h2>
          </div>

          {upcomingConsultations.length > 0 ? (
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Virtual Consultations Scheduled</h3>
                  <p className="text-slate-600 mb-6">
                    You have {upcomingConsultations.length} virtual consultation
                    {upcomingConsultations.length > 1 ? "s" : ""} scheduled for today.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6 mb-6">
                    <h4 className="font-medium text-slate-900 mb-4">Your Scheduled Consultations:</h4>
                    <div className="space-y-3">
                      {upcomingConsultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-slate-900">Patient Consultation</p>
                              <p className="text-sm text-slate-600">{consultation.reason || "General consultation"}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm font-medium text-slate-900">
                                {consultation.appointment_time?.slice(0, 5) || "TBD"}
                              </p>
                              <p className="text-xs text-slate-600">{consultation.duration_minutes || 30} min</p>
                            </div>
                            <Badge
                              variant={consultation.status === "confirmed" ? "default" : "secondary"}
                              className={consultation.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : ""}
                            >
                              {consultation.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">
                    Virtual consultation rooms will be available 15 minutes before each appointment.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent>
                <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Virtual Consultations Today</h3>
                <p className="text-gray-600 mb-6">
                  Your virtual consultation schedule is clear for today. Check your upcoming appointments or patient
                  requests.
                </p>
                <Link href="/doctor/appointments">
                  <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                    View All Appointments
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Doctor Guidelines */}
        <Card className="mt-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Virtual Consultation Guidelines</CardTitle>
                <CardDescription className="text-slate-600">
                  Best practices for conducting professional virtual consultations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Before Consultation */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Before the Consultation</h4>
                <div className="bg-blue-50 rounded-xl p-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-xs">1</span>
                      </div>
                      <span className="text-slate-700">Review patient's medical history and previous notes</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-xs">2</span>
                      </div>
                      <span className="text-slate-700">Prepare necessary forms and documentation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-xs">3</span>
                      </div>
                      <span className="text-slate-700">Test audio/video equipment and internet connection</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-xs">4</span>
                      </div>
                      <span className="text-slate-700">Ensure private, professional environment</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* During Consultation */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">During the Consultation</h4>
                <div className="bg-emerald-50 rounded-xl p-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-emerald-600 text-xs">1</span>
                      </div>
                      <span className="text-slate-700">Maintain professional demeanor and eye contact</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-emerald-600 text-xs">2</span>
                      </div>
                      <span className="text-slate-700">Speak clearly and allow time for patient responses</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-emerald-600 text-xs">3</span>
                      </div>
                      <span className="text-slate-700">Use chat feature for sharing important information</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-emerald-600 text-xs">4</span>
                      </div>
                      <span className="text-slate-700">Document consultation notes in real-time</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Support */}
        <Card className="mt-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Technical Support</CardTitle>
                <CardDescription className="text-slate-600">
                  Get help with technical issues during consultations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="font-medium text-slate-900 mb-2">Emergency Support</h4>
                <p className="text-sm text-slate-600 mb-3">For urgent technical issues during consultations</p>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  Call Support
                </Button>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-slate-900 mb-2">Live Chat</h4>
                <p className="text-sm text-slate-600 mb-3">Get help from our technical support team</p>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  Start Chat
                </Button>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium text-slate-900 mb-2">Help Center</h4>
                <p className="text-sm text-slate-600 mb-3">Browse our comprehensive help documentation</p>
                <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                  View Docs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
