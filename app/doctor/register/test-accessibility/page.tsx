"use client"

import DoctorRegisterPage from "../page"
import { AccessibilityChecker } from "@/components/accessibility/AccessibilityChecker"

export default function TestAccessibilityPage() {
  return (
    <div>
      <DoctorRegisterPage />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AccessibilityChecker />
      </div>
    </div>
  )
}
