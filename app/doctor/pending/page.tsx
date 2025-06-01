"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  FileText,
  Mail,
  Phone,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  ArrowLeft,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// Force dynamic rendering to prevent prerendering issues
export const dynamic = "force-dynamic"

export default function DoctorPendingPage() {
  const [user, setUser] = useState<any>(null)
  const [doctorProfile, setDoctorProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const supabase = createClientComponentClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/signin")
          return
        }

        setUser(user)

        // Get doctor profile
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctors")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (doctorError && doctorError.code !== "PGRST116") {
          console.error("Error fetching doctor profile:", doctorError)
          setError("Failed to load doctor profile")
        } else {
          setDoctorProfile(doctorData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleRefresh = async () => {
    setLoading(true)
    // Refresh the page to check updated status
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Page</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const getStatusInfo = () => {
    if (!doctorProfile) {
      return {
        status: "No Profile",
        color: "bg-gray-100 text-gray-700",
        icon: AlertTriangle,
        message: "No doctor profile found. Please complete your registration.",
      }
    }

    switch (doctorProfile.verification_status) {
      case "pending":
        return {
          status: "Under Review",
          color: "bg-yellow-100 text-yellow-700",
          icon: Clock,
          message: "Your application is being reviewed by our medical team.",
        }
      case "approved":
        if (!doctorProfile.is_active) {
          return {
            status: "Approved - Activation Pending",
            color: "bg-blue-100 text-blue-700",
            icon: CheckCircle,
            message: "Your application has been approved. Account activation is in progress.",
          }
        }
        return {
          status: "Active",
          color: "bg-green-100 text-green-700",
          icon: CheckCircle,
          message: "Your account is active and ready to use.",
        }
      case "rejected":
        return {
          status: "Rejected",
          color: "bg-red-100 text-red-700",
          icon: AlertTriangle,
          message: "Your application was not approved. Please contact support for more information.",
        }
      default:
        return {
          status: "Unknown",
          color: "bg-gray-100 text-gray-700",
          icon: AlertTriangle,
          message: "Unknown status. Please contact support.",
        }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">EveryHealthPH</span>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Doctor Portal</Badge>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StatusIcon className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Application Status</h1>
          <p className="text-gray-600">Welcome, Dr. {user?.user_metadata?.full_name || user?.email}</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Badge className={`px-4 py-2 ${statusInfo.color}`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {statusInfo.status}
              </Badge>
            </div>
            <CardTitle className="text-xl">Application Status</CardTitle>
            <CardDescription>{statusInfo.message}</CardDescription>
          </CardHeader>
          <CardContent>
            {doctorProfile?.verification_status === "pending" && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <p className="font-medium mb-2">What's happening now:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Our medical verification team is reviewing your documents</li>
                    <li>• We're verifying your medical license and credentials</li>
                    <li>• This process typically takes 3-5 business days</li>
                    <li>• You'll receive an email notification once the review is complete</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {doctorProfile?.verification_status === "rejected" && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-2">Application Not Approved</p>
                  <p className="text-sm">
                    {doctorProfile.verification_notes ||
                      "Your application did not meet our verification requirements. Please contact our support team for more details."}
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Next Steps</h3>
                <div className="space-y-3">
                  {doctorProfile?.verification_status === "pending" && (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-blue-600 text-xs font-medium">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Wait for Review</p>
                          <p className="text-sm text-gray-600">Our team is currently reviewing your application</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-gray-600 text-xs font-medium">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Email Notification</p>
                          <p className="text-sm text-gray-600">You'll receive an update via email</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-gray-600 text-xs font-medium">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Account Activation</p>
                          <p className="text-sm text-gray-600">Access your doctor dashboard once approved</p>
                        </div>
                      </div>
                    </>
                  )}

                  {doctorProfile?.verification_status === "rejected" && (
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-red-600 text-xs font-medium">!</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Contact Support</p>
                        <p className="text-sm text-gray-600">Reach out to our team for assistance</p>
                      </div>
                    </div>
                  )}

                  {!doctorProfile && (
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-emerald-600 text-xs font-medium">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Complete Registration</p>
                        <p className="text-sm text-gray-600">Finish your doctor registration process</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Need Help?</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Support</p>
                      <p className="text-sm text-gray-600">doctors@everyhealthph.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone Support</p>
                      <p className="text-sm text-gray-600">+63 2 8123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Support Hours</p>
                      <p className="text-sm text-gray-600">Mon-Fri, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button onClick={handleRefresh} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
              {!doctorProfile && (
                <Link href="/doctor/register" className="flex-1">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Complete Registration
                  </Button>
                </Link>
              )}
              {doctorProfile?.verification_status === "rejected" && (
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
