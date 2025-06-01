"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Clock, MapPin, User, Video, ArrowLeft, Plus, Search, Filter, CheckCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { createClientComponentClient } from "@/lib/supabase/client"
import type { Doctor, Appointment } from "@/lib/database/appointments"

// Add export const dynamic = 'force-dynamic' to prevent static prerendering
export const dynamic = "force-dynamic"

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedType, setSelectedType] = useState<"virtual" | "in_person">("virtual")
  const [reason, setReason] = useState("")
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Use useEffect to ensure this only runs on the client side
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Create Supabase client only on the client side
        const supabase = createClientComponentClient()

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error getting user:", userError)
          setError("Failed to authenticate user")
          setIsLoading(false)
          return
        }

        if (user) {
          setUser(user)

          // Load doctors and appointments
          try {
            // Fetch doctors from the database
            const { data: doctorsData, error: doctorsError } = await supabase
              .from("doctors")
              .select("*")
              .eq("is_verified", true)
              .eq("is_active", true)
              .order("rating", { ascending: false })

            if (doctorsError) {
              console.error("Error loading doctors:", doctorsError)
              setError("Failed to load doctors")
            } else {
              setDoctors(doctorsData || [])
            }

            // Fetch user appointments
            try {
              const { data: appointmentsData, error: appointmentsError } = await supabase
                .from("appointments")
                .select(`
                  *,
                  doctor:doctor_id (*)
                `)
                .eq("user_id", user.id)
                .order("appointment_date", { ascending: true })
                .order("appointment_time", { ascending: true })

              if (appointmentsError) {
                console.error("Error loading appointments:", appointmentsError)
                setError("Failed to load appointments")
              } else {
                setAppointments(appointmentsData || [])
              }
            } catch (err) {
              console.error("Error in appointments fetch:", err)
              setError("Failed to load appointments")
            }
          } catch (err) {
            console.error("Error loading data:", err)
            setError("Failed to load data")
          }
        }
      } catch (err) {
        console.error("General error:", err)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  const handleBookAppointment = async () => {
    if (!user || !selectedDoctor || !date || !selectedTimeSlot || !reason) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const supabase = createClientComponentClient()

      const appointmentData = {
        user_id: user.id,
        doctor_id: selectedDoctor.id,
        appointment_date: format(date, "yyyy-MM-dd"),
        appointment_time:
          selectedTimeSlot.includes("PM") && !selectedTimeSlot.includes("12:")
            ? `${Number.parseInt(selectedTimeSlot.split(":")[0]) + 12}:${selectedTimeSlot.split(":")[1].split(" ")[0]}`
            : selectedTimeSlot.replace(" AM", "").replace(" PM", ""),
        duration_minutes: 30,
        type: selectedType,
        status: "pending",
        reason,
        consultation_fee: selectedDoctor.consultation_fee,
        payment_status: "pending",
        meeting_link: selectedType === "virtual" ? `https://meet.everyhealthph.com/${Date.now()}` : null,
      }

      const { error: insertError } = await supabase.from("appointments").insert(appointmentData)

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Reload appointments
      const { data: updatedAppointments } = await supabase
        .from("appointments")
        .select(`
          *,
          doctor:doctor_id (*)
        `)
        .eq("user_id", user.id)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })

      setAppointments(updatedAppointments || [])

      setSuccess("Appointment booked successfully!")
      setIsBookingOpen(false)

      // Reset form
      setSelectedDoctor(null)
      setDate(undefined)
      setSelectedTimeSlot("")
      setReason("")
    } catch (err) {
      console.error("Error booking appointment:", err)
      setError("Failed to book appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-6 w-6 text-green-600" />
                <span className="text-xl font-semibold text-gray-900">Appointments</span>
              </div>
            </div>
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Book New Appointment</DialogTitle>
                  <DialogDescription>
                    Schedule an appointment with one of our healthcare professionals
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Doctor Selection */}
                  <div>
                    <Label className="text-base font-medium">Select Doctor</Label>
                    <div className="grid gap-3 mt-2 max-h-60 overflow-y-auto">
                      {doctors.map((doctor) => (
                        <Card
                          key={doctor.id}
                          className={`cursor-pointer hover:shadow-md transition-shadow ${
                            selectedDoctor?.id === doctor.id ? "ring-2 ring-green-500" : ""
                          }`}
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{doctor.full_name}</h3>
                                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                <p className="text-sm text-gray-500">{doctor.hospital_affiliation}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-sm text-yellow-600">★ {doctor.rating}</span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {doctor.years_experience} years exp.
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">₱{doctor.consultation_fee}</p>
                                <p className="text-xs text-gray-500">Consultation Fee</p>
                                {selectedDoctor?.id === doctor.id && (
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Consultation Type */}
                  <div>
                    <Label htmlFor="consultation-type">Consultation Type</Label>
                    <Select
                      value={selectedType}
                      onValueChange={(value: "virtual" | "in_person") => setSelectedType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="virtual">Virtual Consultation</SelectItem>
                        <SelectItem value="in_person">In-Person Visit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <Label>Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Slot Selection */}
                  <div>
                    <Label>Available Time Slots</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTimeSlot === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTimeSlot(slot)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div>
                    <Label htmlFor="reason">Reason for Visit *</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe your symptoms or reason for consultation..."
                      className="mt-1"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleBookAppointment}
                    disabled={loading}
                  >
                    {loading ? "Booking..." : "Confirm Appointment"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search appointments..." className="pl-10" />
            </div>
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor?.full_name}</h3>
                        <p className="text-gray-600">{appointment.doctor?.specialty}</p>
                      </div>
                      <Badge
                        variant={appointment.status === "confirmed" ? "default" : "secondary"}
                        className={appointment.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                      >
                        {appointment.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {appointment.appointment_date}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {appointment.appointment_time}
                      </div>
                      <div className="flex items-center text-gray-600">
                        {appointment.type === "virtual" ? (
                          <Video className="h-4 w-4 mr-2" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-2" />
                        )}
                        {appointment.type === "virtual" ? "Virtual" : appointment.doctor?.hospital_affiliation}
                      </div>
                    </div>

                    {appointment.reason && (
                      <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-6">
                    {appointment.type === "virtual" && appointment.status === "confirmed" && (
                      <Link href="/dashboard/consultations">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Video className="h-4 w-4 mr-2" />
                          Join Call
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {appointments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
              <p className="text-gray-600 mb-6">Book your first appointment with one of our healthcare professionals</p>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsBookingOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Book Your First Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
