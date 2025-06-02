"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Stethoscope, ArrowLeft, Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ResponsiveContainer } from "@/components/responsive-container"
import { MobileMenu } from "@/components/mobile-menu"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const menuLinks = [
    { href: "/", label: "Home" },
    { href: "/auth/signin", label: "Sign In" },
    { href: "/auth/signup", label: "Sign Up" },
    { href: "/doctor/login", label: "Doctor Login" },
    { href: "/doctor/register", label: "Join as Doctor" },
    { href: "/help", label: "Help Center" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <MobileMenu links={menuLinks} title="EveryHealthPH Menu" />
              <Link href="/" className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">Contact Us</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <ResponsiveContainer className="py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-gray-600">We're here to help and answer any questions you might have</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone Support</h3>
                      <p className="text-gray-600">Call us for immediate assistance</p>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900">+63 2 8123 4567</p>
                  <p className="text-sm text-gray-600">Available 24/7 for emergencies</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Support</h3>
                      <p className="text-gray-600">Send us a detailed message</p>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900 break-all">support@everyhealthph.com</p>
                  <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Live Chat</h3>
                      <p className="text-gray-600">Chat with our support team</p>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Live Chat</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Office Address</h3>
                      <p className="text-gray-600">Visit our headquarters</p>
                    </div>
                  </div>
                  <p className="text-gray-900">
                    123 Ayala Avenue
                    <br />
                    Makati City, Metro Manila
                    <br />
                    Philippines 1226
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600">When we're available</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Monday - Friday:</span> 8:00 AM - 8:00 PM
                    </p>
                    <p>
                      <span className="font-medium">Saturday:</span> 9:00 AM - 5:00 PM
                    </p>
                    <p>
                      <span className="font-medium">Sunday:</span> 10:00 AM - 4:00 PM
                    </p>
                    <p className="text-gray-500 mt-2">All times are in Philippine Time (PHT)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
                <CardTitle className="text-xl sm:text-2xl">Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-6 sm:px-6 sm:pb-8">
                {isSubmitted ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <p className="font-medium mb-2">Message sent successfully!</p>
                      <p>Thank you for contacting us. We'll respond to your message within 24 hours.</p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Juan Dela Cruz"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="juan@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="medical">Medical Questions</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Contact */}
        <Card className="mt-6 sm:mt-8 bg-red-50 border-red-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Medical Emergency?</h3>
              <p className="text-red-700 mb-4">
                If you're experiencing a medical emergency, please call emergency services immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  Call 911 (Emergency)
                </Button>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  Call 117 (Emergency Hotline)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </div>
  )
}
