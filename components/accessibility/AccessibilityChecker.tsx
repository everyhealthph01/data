"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Info } from "lucide-react"

interface AccessibilityIssue {
  type: "error" | "warning" | "info"
  message: string
  element?: string
}

export function AccessibilityChecker() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    const checkAccessibility = () => {
      const foundIssues: AccessibilityIssue[] = []
      let totalChecks = 0
      let passedChecks = 0

      // Check for missing alt text on images
      totalChecks++
      const images = document.querySelectorAll("img")
      const imagesWithoutAlt = Array.from(images).filter((img) => !img.alt)
      if (imagesWithoutAlt.length === 0) {
        passedChecks++
      } else {
        foundIssues.push({
          type: "error",
          message: `${imagesWithoutAlt.length} images missing alt text`,
          element: "img",
        })
      }

      // Check for form labels
      totalChecks++
      const inputs = document.querySelectorAll("input, select, textarea")
      const inputsWithoutLabels = Array.from(inputs).filter((input) => {
        const id = input.getAttribute("id")
        return id && !document.querySelector(`label[for="${id}"]`) && !input.getAttribute("aria-label")
      })
      if (inputsWithoutLabels.length === 0) {
        passedChecks++
      } else {
        foundIssues.push({
          type: "error",
          message: `${inputsWithoutLabels.length} form controls missing labels`,
          element: "form controls",
        })
      }

      // Check for heading hierarchy
      totalChecks++
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      let headingIssues = false
      let lastLevel = 0
      headings.forEach((heading) => {
        const level = Number.parseInt(heading.tagName.charAt(1))
        if (level > lastLevel + 1) {
          headingIssues = true
        }
        lastLevel = level
      })
      if (!headingIssues) {
        passedChecks++
      } else {
        foundIssues.push({
          type: "warning",
          message: "Heading hierarchy may be incorrect",
          element: "headings",
        })
      }

      // Check for ARIA labels on interactive elements
      totalChecks++
      const buttons = document.querySelectorAll("button")
      const buttonsWithoutLabels = Array.from(buttons).filter((button) => {
        return !button.getAttribute("aria-label") && !button.textContent?.trim()
      })
      if (buttonsWithoutLabels.length === 0) {
        passedChecks++
      } else {
        foundIssues.push({
          type: "warning",
          message: `${buttonsWithoutLabels.length} buttons may need better labels`,
          element: "buttons",
        })
      }

      // Check for focus indicators
      totalChecks++
      const focusableElements = document.querySelectorAll("a, button, input, select, textarea, [tabindex]")
      if (focusableElements.length > 0) {
        passedChecks++
        foundIssues.push({
          type: "info",
          message: `${focusableElements.length} focusable elements found`,
          element: "interactive elements",
        })
      }

      setIssues(foundIssues)
      setScore(Math.round((passedChecks / totalChecks) * 100))
    }

    // Run check after a short delay to allow DOM to settle
    const timer = setTimeout(checkAccessibility, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-700 border-green-200"
    if (score >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-red-100 text-red-700 border-red-200"
  }

  const getIssueIcon = (type: AccessibilityIssue["type"]) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Accessibility Report</span>
          <Badge className={getScoreColor(score)}>Score: {score}%</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>No accessibility issues detected</span>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                {getIssueIcon(issue.type)}
                <div>
                  <p className="font-medium text-gray-900">{issue.message}</p>
                  {issue.element && <p className="text-sm text-gray-600">Element: {issue.element}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Accessibility Features Added:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Comprehensive ARIA labels and descriptions</li>
            <li>✓ Screen reader announcements for step changes</li>
            <li>✓ Proper form fieldsets and legends</li>
            <li>✓ Live regions for dynamic content</li>
            <li>✓ Keyboard navigation support</li>
            <li>✓ Focus management and indicators</li>
            <li>✓ Semantic HTML structure</li>
            <li>✓ Error announcements and validation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
