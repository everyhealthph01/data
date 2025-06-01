"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Clock, Video } from "lucide-react"
import Link from "next/link"

export default function NewConsultation() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect would happen here
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/doctor/dashboard"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Start New Consultation</h1>
          <p className="text-gray-600">Set up a virtual consultation with your patient</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="h-5 w-5 mr-2 text-emerald-600" />
              Consultation Details
            </CardTitle>
            <CardDescription>Fill in the details to create a new virtual consultation</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select required>
                    <SelectTrigger id="patient">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maria-santos">Maria Santos</SelectItem>
                      <SelectItem value="juan-dela-cruz">Juan Dela Cruz</SelectItem>
                      <SelectItem value="ana-rodriguez">Ana Rodriguez</SelectItem>
                      <SelectItem value="carlos-mendoza">Carlos Mendoza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation-type">Consultation Type</Label>
                  <Select defaultValue="follow-up" required>
                    <SelectTrigger id="consultation-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">Initial Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="urgent">Urgent Care</SelectItem>
                      <SelectItem value="specialist">Specialist Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input id="date" type="date" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input id="time" type="time" className="pl-10" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Consultation</Label>
                <Textarea
                  id="reason"
                  placeholder="Brief description of the consultation purpose"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information or instructions for the patient"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Schedule Consultation
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
