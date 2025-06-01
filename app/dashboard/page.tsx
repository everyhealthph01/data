"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, Video, Clock, User, Heart, Activity } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/supabase/client"
import { getUserType, type Patient } from "@/lib/database/users"
import {
  getUpcomingPatientAppointments,
  getTodayPatientAppointments,
  getPatientAppointmentStats,
} from "@/lib/database/appointments"

// Force dynamic rendering
export const dynamic = "force-dynamic"

interface AppointmentStats {
  total: number
  upcoming: number
  completed: number
  cancelled: number
}

interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  status: string
  type: string
  reason?: string
  doctor?: {
    full_name: string
    specialty: string
  }
}

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    async function loadDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // Get current user
        const { data: userData, error: userError } = await getCurrentUser()
        if (userError || !userData.user) {
          setError("Please sign in to access your dashboard")
          return
        }

        setUser(userData.user)

        // Get user profile and type
        const { userType, profile: userProfile } = await getUserType(userData.user.id)

        if (userType === "patient") {
          setProfile(userProfile as Patient)

          // Load appointment data in parallel
          const [upcomingResult, todayResult, statsResult] = await Promise.allSettled([
            getUpcomingPatientAppointments(userData.user.id),
            getTodayPatientAppointments(userData.user.id),
            getPatientAppointmentStats(userData.user.id),
          ])

          // Handle upcoming appointments
          if (upcomingResult.status === "fulfilled" && upcomingResult.value.data) {
            setAppointments(upcomingResult.value.data)
          }

          // Handle today's appointments
          if (todayResult.status === "fulfilled" && todayResult.value.data) {
            setTodayAppointments(todayResult.value.data)
          }

          // Handle stats
          if (statsResult.status === "fulfilled" && statsResult.value.data) {
            setStats(statsResult.value.data)
          }
        } else if (userType === "doctor") {
          // Redirect doctors to their dashboard
          window.location.href = "/doctor/dashboard"
          return
        }
      } catch (err) {
        console.error("Dashboard loading error:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.full_name || profile?.emergency_contact_name || "Patient"}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your health dashboard overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Today's Appointments
              </CardTitle>
              <CardDescription>Your scheduled appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">
                            {appointment.appointment_time?.slice(0, 5)} - {appointment.doctor?.full_name}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.doctor?.specialty}</p>
                          <p className="text-sm text-gray-500">{appointment.reason || "General consultation"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                        {appointment.type === "virtual" && (
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments scheduled for today</p>
                  <Link href="/dashboard/appointments">
                    <Button className="mt-4">Schedule Appointment</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/appointments">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>

              <Link href="/dashboard/chat">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Health Chat
                </Button>
              </Link>

              <Link href="/dashboard/consultations">
                <Button className="w-full justify-start" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Virtual Consultations
                </Button>
              </Link>

              <Link href="/dashboard/profile">
                <Button className="w-full justify-start" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        {appointments.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your next scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">
                          {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                          {appointment.appointment_time?.slice(0, 5)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.doctor?.full_name} - {appointment.doctor?.specialty}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.reason || "General consultation"}</p>
                      </div>
                    </div>
                    <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
              {appointments.length > 5 && (
                <div className="mt-4 text-center">
                  <Link href="/dashboard/appointments">
                    <Button variant="outline">View All Appointments</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
