"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope, ArrowLeft, Shield, Eye, Lock, Database, Users, FileText } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
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
                <span className="text-xl font-semibold text-gray-900">Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">Your privacy and data security are our top priorities</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: December 2024</p>
        </div>

        {/* Privacy Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Encrypted Data</h3>
              <p className="text-gray-600 text-sm">All your health data is encrypted with enterprise-grade security</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Data Selling</h3>
              <p className="text-gray-600 text-sm">
                We never sell your personal or health information to third parties
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Control</h3>
              <p className="text-gray-600 text-sm">You have full control over your data and can delete it anytime</p>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Policy Content */}
        <Card>
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                1. Information We Collect
              </h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Name, email address, phone number, and date of birth</li>
                  <li>Profile information and preferences</li>
                  <li>Payment and billing information</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Health Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Medical history and health records</li>
                  <li>Symptoms and health concerns shared with our AI assistant</li>
                  <li>Appointment and consultation records</li>
                  <li>Health metrics and tracking data</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Device information and IP address</li>
                  <li>Usage patterns and app interactions</li>
                  <li>Log files and analytics data</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="h-6 w-6 mr-2 text-blue-600" />
                2. How We Use Your Information
              </h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Uses</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Provide personalized health guidance and AI assistance</li>
                  <li>Facilitate appointments and virtual consultations</li>
                  <li>Maintain your health records and history</li>
                  <li>Process payments and manage your account</li>
                  <li>Send important notifications and updates</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Improvement</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Improve our AI algorithms and health recommendations</li>
                  <li>Enhance user experience and platform functionality</li>
                  <li>Conduct research for better healthcare outcomes</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-blue-600" />
                3. Data Protection & Security
              </h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Measures</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>End-to-end encryption for all sensitive data</li>
                  <li>Secure data centers with 24/7 monitoring</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Multi-factor authentication for account access</li>
                  <li>HIPAA-compliant data handling procedures</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Storage</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Data stored in secure, encrypted databases</li>
                  <li>Regular backups with secure recovery procedures</li>
                  <li>Data retention policies based on legal requirements</li>
                  <li>Secure deletion when data is no longer needed</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                4. Information Sharing
              </h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Healthcare Providers</h3>
                <p className="text-gray-700 mb-4">
                  We share relevant health information with healthcare providers only when you book appointments or
                  consultations, and only with your explicit consent.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Providers</h3>
                <p className="text-gray-700 mb-4">
                  We work with trusted third-party service providers who help us operate our platform. These providers
                  are bound by strict confidentiality agreements and can only use your data for the specific services
                  they provide to us.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Requirements</h3>
                <p className="text-gray-700">
                  We may disclose information when required by law, court order, or to protect the rights, property, or
                  safety of EveryHealthPH, our users, or others.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-2 text-blue-600" />
                5. Your Rights & Choices
              </h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Access & Control</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Access and download your personal data</li>
                  <li>Correct or update your information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt-out of non-essential communications</li>
                  <li>Control data sharing preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication Preferences</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Choose which notifications you receive</li>
                  <li>Set frequency of health reminders</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Manage cookie preferences</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies & Tracking</h2>
              <div className="mb-8">
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to improve your experience, analyze usage patterns, and
                  provide personalized content. You can control cookie settings through your browser preferences.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Types of Cookies</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic platform functionality
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how you use our platform
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings and preferences
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Used to show relevant advertisements (optional)
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
              <div className="mb-8">
                <p className="text-gray-700">
                  Our platform is not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If you are a parent or guardian and believe your child has
                  provided us with personal information, please contact us immediately.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
              <div className="mb-8">
                <p className="text-gray-700">
                  Your information may be transferred to and processed in countries other than the Philippines. We
                  ensure that such transfers comply with applicable data protection laws and that your information
                  receives adequate protection.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <div className="mb-8">
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new policy on our platform and sending you an email notification. Your continued use of
                  our services after such changes constitutes acceptance of the updated policy.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong> privacy@everyhealthph.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +63 2 8123 4567
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Ayala Avenue, Makati City, Metro Manila, Philippines 1226
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
