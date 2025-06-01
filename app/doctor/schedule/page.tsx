"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, Save } from "lucide-react"
import Link from "next/link"

export default function DoctorSchedule() {
  const [isLoading, setIsLoading] = useState(false)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeSlots = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
  ]

  const handleSave = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/doctor/dashboard"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Schedule</h1>
          <p className="text-gray-600">Set your availability for appointments and consultations</p>
        </div>

        <Tabs defaultValue="availability">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-emerald-600" />
                  Weekly Availability
                </CardTitle>
                <CardDescription>Set your regular weekly schedule for patient appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {days.map((day) => (
                    <div key={day} className="border-b pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">{day}</h3>
                        <div className="flex items-center space-x-2">
                          <Checkbox id={`available-${day.toLowerCase()}`} defaultChecked={day !== "Sunday"} />
                          <Label htmlFor={`available-${day.toLowerCase()}`}>Available</Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {timeSlots.map((slot) => (
                          <div
                            key={`${day}-${slot}`}
                            className="flex items-center space-x-2 bg-white p-2 rounded-md border"
                          >
                            <Checkbox
                              id={`${day}-${slot}`}
                              defaultChecked={day !== "Sunday" && slot !== "4:00 PM - 5:00 PM"}
                            />
                            <Label htmlFor={`${day}-${slot}`} className="text-sm">
                              {slot}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Schedule
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>View and manage your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-emerald-500" />
                  <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                  <p className="text-gray-500 mb-4">View your appointments in a calendar format</p>
                  <Button>Open Calendar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Settings</CardTitle>
                <CardDescription>Configure your appointment preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-emerald-500" />
                  <h3 className="text-lg font-medium mb-2">Appointment Settings</h3>
                  <p className="text-gray-500 mb-4">
                    Configure appointment duration, buffer time, and notification preferences
                  </p>
                  <Button>Configure Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
