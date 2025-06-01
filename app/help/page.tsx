"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Stethoscope,
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  User,
  Calendar,
  Video,
  Shield,
  CreditCard,
} from "lucide-react"
import Link from "next/link"

export default function HelpCenterPage() {
  const helpCategories = [
    {
      icon: User,
      title: "Getting Started",
      description: "Learn the basics of using EveryHealthPH",
      articles: [
        "How to create your account",
        "Setting up your health profile",
        "Understanding your dashboard",
        "First steps with AI assistant",
      ],
    },
    {
      icon: MessageCircle,
      title: "AI Health Assistant",
      description: "Get help with our AI-powered health guidance",
      articles: [
        "How to ask health questions",
        "Understanding AI responses",
        "When to consult a real doctor",
        "AI assistant limitations",
      ],
    },
    {
      icon: Calendar,
      title: "Appointments",
      description: "Booking and managing your appointments",
      articles: [
        "How to book an appointment",
        "Rescheduling appointments",
        "Cancellation policies",
        "Appointment reminders",
      ],
    },
    {
      icon: Video,
      title: "Virtual Consultations",
      description: "Video calls with healthcare professionals",
      articles: [
        "Preparing for virtual consultations",
        "Technical requirements",
        "Troubleshooting video issues",
        "Recording and privacy",
      ],
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Payment methods and billing questions",
      articles: ["Accepted payment methods", "Understanding your bill", "Refund policies", "Insurance coverage"],
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your data protection and account security",
      articles: ["How we protect your data", "Account security settings", "Privacy controls", "Data sharing policies"],
    },
  ]

  const popularArticles = [
    "How to book your first appointment",
    "Understanding AI health recommendations",
    "Setting up virtual consultation",
    "Managing your health records",
    "Troubleshooting login issues",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">EveryHealthPH Help Center</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to common questions and get support</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help articles..."
              className="pl-12 h-14 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quick Contact */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-4">Get instant help from our support team</p>
              <Button className="bg-green-600 hover:bg-green-700">Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm mb-4">Call us for immediate assistance</p>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                +63 2 8123 4567
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-4">Send us a detailed message</p>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <ul className="space-y-3">
              {popularArticles.map((article, index) => (
                <li key={index}>
                  <Link href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                    <HelpCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                    {article}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Hours */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
                <p className="text-gray-600">Monday - Friday: 8:00 AM - 8:00 PM (PHT)</p>
                <p className="text-gray-600">Saturday - Sunday: 9:00 AM - 5:00 PM (PHT)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
