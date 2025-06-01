"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Mail, Clock, FileText, ArrowLeft, Phone } from "lucide-react"
import Link from "next/link"

export default function DoctorRegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl text-emerald-900">Application Submitted Successfully!</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Thank you for applying to join EveryHealthPH as a healthcare provider
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="border-emerald-200 bg-emerald-50">
              <Mail className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800">
                <p className="font-medium mb-2">What happens next?</p>
                <ul className="text-sm space-y-1">
                  <li>• You will receive a confirmation email shortly</li>
                  <li>• Our medical verification team will review your application</li>
                  <li>• We may contact you for additional information if needed</li>
                  <li>• You'll receive an approval decision within 3-5 business days</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Timeline
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-emerald-700">Application Submitted</p>
                      <p className="text-gray-600">Today</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-700">Document Review</p>
                      <p className="text-gray-600">1-2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-700">Medical Verification</p>
                      <p className="text-gray-600">2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-700">Final Approval</p>
                      <p className="text-gray-600">3-5 business days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Application Reference
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Reference Number:</p>
                  <p className="font-mono text-lg font-semibold text-gray-900">
                    DR-{new Date().getFullYear()}-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Please save this reference number for your records</p>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Phone className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <p className="font-medium mb-2">Need Help?</p>
                <p className="text-sm">
                  If you have any questions about your application, please contact our support team:
                </p>
                <div className="mt-2 text-sm space-y-1">
                  <p>📧 Email: doctors@everyhealthph.com</p>
                  <p>📞 Phone: +63 2 8123 4567</p>
                  <p>🕒 Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/auth/signin" className="flex-1">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Sign In to Your Account</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
