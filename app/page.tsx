"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, ArrowRight, Shield, Clock, Users, Star, UserCheck } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EveryHealthPH</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Fixed Layout */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 px-4 py-2 text-sm font-medium">
            AI-Powered Health Assistant
          </Badge>

          {/* Fixed Hero Title with Proper Spacing */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Your Personal
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 bg-clip-text text-transparent">
                Medical AI
              </span>
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Assistant
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Get instant health insights, symptom analysis, and wellness advice powered by advanced AI.
            <br className="hidden sm:block" />
            Available 24/7 to support your health journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
              >
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EveryHealthPH?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of healthcare with our comprehensive AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Private</h3>
              <p className="text-gray-600">
                Your health data is protected with enterprise-grade security and complete privacy compliance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Available</h3>
              <p className="text-gray-600">
                Get instant health guidance anytime, anywhere. Our AI assistant never sleeps.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Network</h3>
              <p className="text-gray-600">
                Connect with licensed healthcare professionals across the Philippines when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-600 font-medium">4.9/5 from 10,000+ users</span>
          </div>
          <p className="text-lg text-gray-600">
            "EveryHealthPH has transformed how I manage my family's health. The AI assistant is incredibly helpful!"
          </p>
          <p className="text-sm text-gray-500 mt-2">- Maria Santos, Manila</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Health Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Filipinos who trust EveryHealthPH for their healthcare needs
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Stethoscope className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">EveryHealthPH</span>
              </div>
              <p className="text-gray-400">Empowering Filipinos with accessible, AI-powered healthcare solutions.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Assistant</li>
                <li>Virtual Consultations</li>
                <li>Appointment Booking</li>
                <li>Health Tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Doctors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/doctor/register" className="hover:text-white">
                    Join as Doctor
                  </Link>
                </li>
                <li>
                  <Link href="/doctor/login" className="hover:text-white">
                    Doctor Portal
                  </Link>
                </li>
                <li>Telemedicine Platform</li>
                <li>Practice Management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Healthcare Professionals Section */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">For Healthcare Professionals</h3>
              <p className="text-gray-400 mb-6">Join our network of verified doctors and expand your practice</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/doctor/register">
                  <Button
                    variant="outline"
                    className="bg-transparent border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-gray-900 px-6 py-2"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Join as Doctor
                  </Button>
                </Link>
                <Link href="/doctor/login">
                  <Button
                    variant="outline"
                    className="bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 px-6 py-2"
                  >
                    Doctor Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EveryHealthPH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
