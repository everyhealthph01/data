"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope, ArrowLeft, FileText, Scale, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
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
                <span className="text-xl font-semibold text-gray-900">Terms of Service</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">Please read these terms carefully before using our services</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: December 2024</p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Important Medical Disclaimer</h3>
                <p className="text-yellow-800 text-sm">
                  EveryHealthPH provides health information and AI-powered guidance for educational purposes only. Our
                  services are not a substitute for professional medical advice, diagnosis, or treatment. Always consult
                  with qualified healthcare professionals for medical concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <Card>
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                1. Acceptance of Terms
              </h2>
              <div className="mb-8">
                <p className="text-gray-700 mb-4">
                  By accessing or using EveryHealthPH ("the Platform"), you agree to be bound by these Terms of Service
                  ("Terms"). If you do not agree to these Terms, please do not use our services.
                </p>
                <p className="text-gray-700">
                  These Terms constitute a legally binding agreement between you and EveryHealthPH, Inc. ("Company",
                  "we", "us", or "our"). Your use of the Platform is also governed by our Privacy Policy.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
              <div className="mb-8">
                <p className="text-gray-700 mb-4">EveryHealthPH provides an AI-powered health platform that offers:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>AI health assistant for general health information and guidance</li>
                  <li>Appointment booking with licensed healthcare providers</li>
                  <li>Virtual consultation services</li>
                  <li>Health tracking and record management</li>
                  <li>Educational health content and resources</li>
                </ul>
                <p className="text-gray-700">
                  Our services are designed to supplement, not replace, professional medical care and advice.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Medical Disclaimer</h2>
              <div className="mb-8 bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Important Medical Information</h3>
                <ul className="list-disc list-inside text-red-800 space-y-2">
                  <li>Our AI assistant provides general health information only, not medical advice</li>
                  <li>
                    Information provided is for educational purposes and should not replace professional medical
                    consultation
                  </li>
                  <li>Always consult qualified healthcare professionals for medical diagnosis and treatment</li>
                  <li>In case of medical emergencies, contact emergency services immediately</li>
                  <li>We do not guarantee the accuracy or completeness of health information provided</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts and Responsibilities</h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Creation</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must be at least 18 years old to create an account</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">User Conduct</h3>
                <p className="text-gray-700 mb-2">You agree not to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Use the Platform for any illegal or unauthorized purpose</li>
                  <li>Share false, misleading, or harmful health information</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Platform's operation</li>
                  <li>Use the Platform to harass, abuse, or harm others</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Healthcare Provider Services</h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Licensed Professionals</h3>
                <p className="text-gray-700 mb-4">
                  Healthcare providers on our platform are licensed professionals who maintain their own professional
                  liability and are responsible for their medical advice and treatment decisions.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Appointment and Consultation Terms</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Appointments are subject to healthcare provider availability</li>
                  <li>Cancellation policies vary by provider and will be clearly stated</li>
                  <li>Virtual consultations require stable internet connection and compatible devices</li>
                  <li>Recording of consultations requires explicit consent from all parties</li>
                  <li>Emergency situations should be directed to appropriate emergency services</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fees and Billing</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Consultation fees are set by individual healthcare providers</li>
                  <li>Platform fees may apply for certain services</li>
                  <li>All fees are clearly displayed before booking or purchase</li>
                  <li>Payment is required at the time of booking unless otherwise specified</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Refunds and Cancellations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Refund policies vary by service type and healthcare provider</li>
                  <li>Cancellations made within the specified timeframe may be eligible for refunds</li>
                  <li>No-show appointments may result in forfeiture of fees</li>
                  <li>Disputed charges can be addressed through our customer support</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <div className="mb-8">
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our collection, use, and protection of your personal and health
                  information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Health Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Health information is protected under applicable privacy laws</li>
                  <li>We use industry-standard security measures to protect your data</li>
                  <li>You control who has access to your health information</li>
                  <li>Data sharing with healthcare providers requires your explicit consent</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Content</h3>
                <p className="text-gray-700 mb-4">
                  All content on the Platform, including text, graphics, logos, software, and AI algorithms, is owned by
                  EveryHealthPH or our licensors and is protected by intellectual property laws.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">User Content</h3>
                <p className="text-gray-700">
                  You retain ownership of content you submit to the Platform. By submitting content, you grant us a
                  license to use, modify, and display such content for the purpose of providing our services.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers and Limitations</h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Availability</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                  <li>Maintenance and updates may temporarily affect service availability</li>
                  <li>We are not liable for service interruptions beyond our reasonable control</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                <p className="text-gray-700">
                  To the maximum extent permitted by law, EveryHealthPH shall not be liable for any indirect,
                  incidental, special, or consequential damages arising from your use of the Platform.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Termination</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>You may terminate your account at any time through your account settings</li>
                  <li>We may suspend or terminate accounts that violate these Terms</li>
                  <li>Upon termination, your access to the Platform will cease</li>
                  <li>Certain provisions of these Terms will survive termination</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <div className="mb-8">
                <p className="text-gray-700">
                  These Terms are governed by the laws of the Republic of the Philippines. Any disputes arising from
                  these Terms or your use of the Platform will be subject to the exclusive jurisdiction of the courts in
                  Metro Manila, Philippines.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <div className="mb-8">
                <p className="text-gray-700">
                  We may update these Terms from time to time. We will notify you of material changes by posting the
                  updated Terms on our Platform and sending you an email notification. Your continued use of the
                  Platform after such changes constitutes acceptance of the updated Terms.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong> legal@everyhealthph.com
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
