"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Users,
  Video,
  Clock,
  Activity,
  Stethoscope,
  UserPlus,
  CalendarPlus,
  LogOut,
  Shield,
  Bell,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut, getCurrentUser } from "@/lib/supabase/client"

// Force dynamic rendering to prevent prerendering issues
export const dynamic = "force-dynamic"

interface UserProfile {
  id: string
  name: string
  email: string
  specialty: string
  license: string
  avatar: string
}

export default function DoctorDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [doctorProfile, setDoctorProfile] = useState<any>(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current user with error handling
        const { data, error: userError } = await getCurrentUser()

        if (userError) {
          console.error("User fetch error:", userError)
          setError("Failed to authenticate. Please try logging in again.")
          router.push("/doctor/login")
          return
        }

        if (!data.user) {
          router.push("/doctor/login")
          return
        }

        const currentUser = data.user

        // Set user data with fallbacks
        setUser({
          id: currentUser.id,
          name: currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Doctor",
          email: currentUser.email || "",
          specialty: "General Medicine",
          license: "Pending Verification",
          avatar: currentUser.user_metadata?.avatar_url || "/placeholder.svg?height=40&width=40",
        })

        // Mock doctor profile data for demo
        setDoctorProfile({
          specialty: "General Medicine",
          license_number: "LIC123456",
          total_patients: 45,
          new_patients_this_month: 8,
          avg_consultation_minutes: 25,
          avg_consultation_change: -2,
        })

        // Mock upcoming appointments for demo
        setUpcomingAppointments([
          {
            id: "1",
            appointment_date: new Date().toISOString().split("T")[0],
            appointment_time: "10:00",
            type: "virtual",
            status: "confirmed",
            reason: "General consultation",
            patient: { full_name: "John Doe" },
          },
          {
            id: "2",
            appointment_date: new Date().toISOString().split("T")[0],
            appointment_time: "14:30",
            type: "consultation",
            status: "pending",
            reason: "Follow-up",
            patient: { full_name: "Jane Smith" },
          },
        ])
      } catch (error) {
        console.error("Error in fetchUser:", error)
        setError("An unexpected error occurred. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/doctor/login")
    } catch (error) {
      console.error("Error signing out:", error)
      // Force redirect even if sign out fails
      router.push("/doctor/login")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/doctor/login")} className="w-full">
            Return to Login
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const todayAppointments = upcomingAppointments.filter(
    (apt) => new Date(apt.appointment_date).toDateString() === new Date().toDateString(),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-600 rounded-full">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EveryHealthPH</span>
              </Link>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                <Shield className="h-3 w-3 mr-1" />
                Doctor Portal
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.specialty}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
          <p className="text-gray-600 mt-2">
            {user.specialty} • License: {user.license}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayAppointments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {todayAppointments.filter((apt) => apt.type === "virtual").length} virtual,{" "}
                    {todayAppointments.filter((apt) => apt.type === "consultation").length} in-person
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Virtual Consultations</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {upcomingAppointments.filter((apt) => apt.type === "virtual").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Next:{" "}
                    {upcomingAppointments.filter((apt) => apt.type === "virtual").length > 0
                      ? upcomingAppointments.filter((apt) => apt.type === "virtual")[0].appointment_time
                      : "None"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctorProfile?.total_patients || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{doctorProfile?.new_patients_this_month || 0} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Consultation</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctorProfile?.avg_consultation_minutes || 25}m</div>
                  <p className="text-xs text-muted-foreground">
                    {doctorProfile?.avg_consultation_change || -2}m from last week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-emerald-600" />
                    <span>Virtual Consultations</span>
                  </CardTitle>
                  <CardDescription>Manage your video consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/doctor/consultations">
                    <Button className="w-full">View Consultations</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Appointments</span>
                  </CardTitle>
                  <CardDescription>View and manage appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/doctor/schedule">
                    <Button variant="outline" className="w-full">
                      Manage Schedule
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>Patients</span>
                  </CardTitle>
                  <CardDescription>Patient records and history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/doctor/patients">
                    <Button variant="outline" className="w-full">
                      View Patients
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your appointments for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{appointment.patient?.full_name || "Patient"}</p>
                          <p className="text-sm text-gray-600">{appointment.reason || "General Consultation"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{appointment.appointment_time}</p>
                          <Badge variant={appointment.type === "consultation" ? "secondary" : "outline"}>
                            {appointment.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No appointments scheduled for today</p>
                  )}
                  <Button variant="outline" className="w-full">
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest consultations and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Activity className="h-4 w-4 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Dashboard accessed</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <UserPlus className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Profile updated</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CalendarPlus className="h-4 w-4 text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Schedule synchronized</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Manage your patient records and history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Management</h3>
                  <p className="text-gray-600 mb-4">
                    View and manage your patient records, medical history, and treatment plans.
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">View All Patients</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Management</CardTitle>
                <CardDescription>Manage your appointments and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Management</h3>
                  <p className="text-gray-600 mb-4">
                    Set your availability, manage appointments, and view your calendar.
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Manage Schedule</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Practice Analytics</CardTitle>
                <CardDescription>View insights about your practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Practice Analytics</h3>
                  <p className="text-gray-600 mb-4">
                    Track your practice performance, patient satisfaction, and revenue insights.
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">View Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
