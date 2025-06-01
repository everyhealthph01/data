"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Users, UserPlus, FileText, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function PatientRecords() {
  const [searchQuery, setSearchQuery] = useState("")

  const patients = [
    {
      id: "P001",
      name: "Maria Santos",
      age: 42,
      gender: "Female",
      lastVisit: "May 15, 2023",
      condition: "Hypertension",
      status: "Active",
    },
    {
      id: "P002",
      name: "Juan Dela Cruz",
      age: 35,
      gender: "Male",
      lastVisit: "June 3, 2023",
      condition: "Diabetes Type 2",
      status: "Active",
    },
    {
      id: "P003",
      name: "Ana Rodriguez",
      age: 28,
      gender: "Female",
      lastVisit: "April 22, 2023",
      condition: "Asthma",
      status: "Active",
    },
    {
      id: "P004",
      name: "Carlos Mendoza",
      age: 56,
      gender: "Male",
      lastVisit: "May 30, 2023",
      condition: "Arthritis",
      status: "Active",
    },
    {
      id: "P005",
      name: "Lisa Garcia",
      age: 31,
      gender: "Female",
      lastVisit: "June 10, 2023",
      condition: "Migraine",
      status: "Active",
    },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Records</h1>
          <p className="text-gray-600">Manage your patient database and medical records</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name, ID, or condition"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="referred">Referred</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-emerald-600" />
                  Patient List
                </CardTitle>
                <CardDescription>{filteredPatients.length} patients found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Patient ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Age/Gender</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Condition</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Last Visit</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <tr key={patient.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{patient.id}</td>
                            <td className="py-3 px-4 font-medium">{patient.name}</td>
                            <td className="py-3 px-4">
                              {patient.age} / {patient.gender}
                            </td>
                            <td className="py-3 px-4">{patient.condition}</td>
                            <td className="py-3 px-4">{patient.lastVisit}</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                {patient.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">View Records</span>
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Calendar className="h-4 w-4" />
                                  <span className="sr-only">Schedule</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-500">
                            No patients found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button variant="outline">
                Load More
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Patients you've seen in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-emerald-500" />
                  <h3 className="text-lg font-medium mb-2">Recent Patient Visits</h3>
                  <p className="text-gray-500 mb-4">View patients you've recently consulted with</p>
                  <Button>View Recent Patients</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Patients</CardTitle>
                <CardDescription>Patients with upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-emerald-500" />
                  <h3 className="text-lg font-medium mb-2">Upcoming Appointments</h3>
                  <p className="text-gray-500 mb-4">View patients with scheduled appointments</p>
                  <Button>View Schedule</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referred">
            <Card>
              <CardHeader>
                <CardTitle>Referred Patients</CardTitle>
                <CardDescription>Patients referred to you by other doctors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-emerald-500" />
                  <h3 className="text-lg font-medium mb-2">Referrals</h3>
                  <p className="text-gray-500 mb-4">View patients referred to your practice</p>
                  <Button>View Referrals</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
