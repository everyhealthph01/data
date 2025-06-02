"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  Upload,
  Shield,
  CheckCircle,
  AlertTriangle,
  Phone,
  MapPin,
  GraduationCap,
  Building,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@/lib/supabase/client"
import { ResponsiveContainer } from "@/components/responsive-container"

interface DocumentUpload {
  file: File | null
  preview: string | null
  uploaded: boolean
}

export default function DoctorRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const [announcement, setAnnouncement] = useState("")

  // Add these helper functions at the component level
  const getStepAriaLabel = (step: number) => {
    switch (step) {
      case 1:
        return "Step 1 of 4: Personal Information"
      case 2:
        return "Step 2 of 4: Professional Information"
      case 3:
        return "Step 3 of 4: Document Verification"
      case 4:
        return "Step 4 of 4: Review and Submit"
      default:
        return `Step ${step} of 4`
    }
  }

  const getProgressPercentage = () => (currentStep / 4) * 100

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
  })

  // Professional Information
  const [professionalInfo, setProfessionalInfo] = useState({
    licenseNumber: "",
    specialty: "",
    subSpecialty: "",
    yearsExperience: "",
    medicalSchool: "",
    graduationYear: "",
    residencyHospital: "",
    residencyYear: "",
    fellowshipProgram: "",
    fellowshipYear: "",
    currentHospital: "",
    currentPosition: "",
    consultationFee: "",
    availableDays: [] as string[],
    availableHours: {
      start: "",
      end: "",
    },
    bio: "",
    languages: [] as string[],
  })

  // Document uploads
  const [documents, setDocuments] = useState({
    medicalLicense: { file: null, preview: null, uploaded: false } as DocumentUpload,
    medicalDiploma: { file: null, preview: null, uploaded: false } as DocumentUpload,
    prcId: { file: null, preview: null, uploaded: false } as DocumentUpload,
    residencyCertificate: { file: null, preview: null, uploaded: false } as DocumentUpload,
    hospitalAffiliation: { file: null, preview: null, uploaded: false } as DocumentUpload,
    validId: { file: null, preview: null, uploaded: false } as DocumentUpload,
    profilePhoto: { file: null, preview: null, uploaded: false } as DocumentUpload,
  })

  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    medicalEthics: false,
    dataSharing: false,
  })

  const specialties = [
    "Internal Medicine",
    "Pediatrics",
    "Obstetrics and Gynecology",
    "Surgery",
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Psychiatry",
    "Orthopedics",
    "Ophthalmology",
    "ENT (Otolaryngology)",
    "Radiology",
    "Pathology",
    "Anesthesiology",
    "Emergency Medicine",
    "Family Medicine",
    "Pulmonology",
    "Gastroenterology",
    "Nephrology",
    "Endocrinology",
    "Oncology",
    "Rheumatology",
    "Infectious Disease",
    "Geriatrics",
    "Sports Medicine",
  ]

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const languages = ["English", "Filipino", "Tagalog", "Cebuano", "Ilocano", "Hiligaynon", "Waray", "Kapampangan"]

  const requiredDocuments = [
    {
      key: "medicalLicense",
      title: "Medical License",
      description: "Valid PRC Medical License",
      required: true,
    },
    {
      key: "medicalDiploma",
      title: "Medical Diploma",
      description: "Medical School Diploma/Certificate",
      required: true,
    },
    {
      key: "prcId",
      title: "PRC ID",
      description: "Professional Regulation Commission ID",
      required: true,
    },
    {
      key: "residencyCertificate",
      title: "Residency Certificate",
      description: "Certificate of Completion of Residency Training",
      required: true,
    },
    {
      key: "hospitalAffiliation",
      title: "Hospital Affiliation",
      description: "Current Hospital Affiliation Certificate",
      required: false,
    },
    {
      key: "validId",
      title: "Valid Government ID",
      description: "Driver's License, Passport, or National ID",
      required: true,
    },
    {
      key: "profilePhoto",
      title: "Professional Photo",
      description: "Professional headshot for profile",
      required: true,
    },
  ]

  const handleFileUpload = (documentKey: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setDocuments((prev) => ({
        ...prev,
        [documentKey]: {
          file,
          preview: e.target?.result as string,
          uploaded: true,
        },
      }))
    }
    reader.readAsDataURL(file)
  }

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfessionalInfoChange = (field: string, value: string | string[]) => {
    setProfessionalInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleDayToggle = (day: string) => {
    setProfessionalInfo((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setProfessionalInfo((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }))
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (
          !personalInfo.firstName ||
          !personalInfo.lastName ||
          !personalInfo.email ||
          !personalInfo.password ||
          !personalInfo.phone
        ) {
          setError("Please fill in all required personal information fields")
          return false
        }
        if (personalInfo.password !== personalInfo.confirmPassword) {
          setError("Passwords do not match")
          return false
        }
        if (personalInfo.password.length < 6) {
          setError("Password must be at least 6 characters long")
          return false
        }
        break
      case 2:
        if (
          !professionalInfo.licenseNumber ||
          !professionalInfo.specialty ||
          !professionalInfo.yearsExperience ||
          !professionalInfo.medicalSchool
        ) {
          setError("Please fill in all required professional information fields")
          return false
        }
        break
      case 3:
        const requiredDocs = requiredDocuments.filter((doc) => doc.required)
        const uploadedRequiredDocs = requiredDocs.filter((doc) => documents[doc.key as keyof typeof documents].uploaded)
        if (uploadedRequiredDocs.length < requiredDocs.length) {
          setError("Please upload all required documents")
          return false
        }
        break
      case 4:
        if (!agreements.termsOfService || !agreements.privacyPolicy || !agreements.medicalEthics) {
          setError("Please accept all required agreements")
          return false
        }
        break
    }
    setError("")
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const newStep = Math.min(currentStep + 1, 4)
      setCurrentStep(newStep)
      setAnnouncement(`Moved to ${getStepAriaLabel(newStep)}`)
    }
  }

  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, 1)
    setCurrentStep(newStep)
    setAnnouncement(`Moved to ${getStepAriaLabel(newStep)}`)
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsLoading(true)
    setError("")

    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase.auth.signUp({
        email: personalInfo.email,
        password: personalInfo.password,
        options: {
          data: {
            full_name: `Dr. ${personalInfo.firstName} ${personalInfo.lastName}`,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess(
        "Registration submitted successfully! Your application will be reviewed by our medical team. You will receive an email within 3-5 business days regarding your application status.",
      )

      setTimeout(() => {
        router.push("/doctor/register/success")
      }, 3000)
    } catch (err) {
      setError("An unexpected error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold text-gray-900 mb-4">Personal Information</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                    placeholder="Juan"
                    required
                    aria-label="Doctor's first name"
                    aria-describedby="firstName-help"
                    aria-required="true"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                    placeholder="Dela Cruz"
                    required
                    aria-label="Doctor's last name"
                    aria-describedby="lastName-help"
                    aria-required="true"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                      placeholder="dr.juan@example.com"
                      className="pl-10"
                      required
                      aria-label="Doctor's email address"
                      aria-describedby="email-help email-error"
                      aria-required="true"
                      aria-invalid={error && error.includes("email") ? "true" : "false"}
                      onBlur={(e) => {
                        const email = e.target.value
                        if (email && !emailRegex.test(email)) {
                          setError("Please enter a valid email address")
                        } else {
                          setError("")
                        }
                      }}
                    />
                  </div>
                  <div id="email-help" className="sr-only">
                    Enter your professional email address that you use for medical practice
                  </div>
                  {error && error.includes("email") && (
                    <div id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                      {error}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                      placeholder="+63 912 345 6789"
                      className="pl-10"
                      required
                      aria-label="Doctor's phone number"
                      aria-describedby="phone-help"
                      aria-required="true"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => handlePersonalInfoChange("dateOfBirth", e.target.value)}
                    aria-label="Doctor's date of birth"
                    aria-describedby="dateOfBirth-help"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={personalInfo.gender}
                    onValueChange={(value) => handlePersonalInfoChange("gender", value)}
                  >
                    <SelectTrigger aria-label="Doctor's gender" aria-describedby="gender-help">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type="password"
                      value={personalInfo.password}
                      onChange={(e) => handlePersonalInfoChange("password", e.target.value)}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      aria-label="Doctor's password"
                      aria-describedby="password-help"
                      aria-required="true"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={personalInfo.confirmPassword}
                      onChange={(e) => handlePersonalInfoChange("confirmPassword", e.target.value)}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      aria-label="Confirm doctor's password"
                      aria-describedby="confirmPassword-help"
                      aria-required="true"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="font-medium text-gray-900 mb-3">Address Information</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
                      placeholder="123 Main Street, Barangay"
                      className="pl-10"
                      aria-label="Doctor's street address"
                      aria-describedby="address-help"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={personalInfo.city}
                    onChange={(e) => handlePersonalInfoChange("city", e.target.value)}
                    placeholder="Manila"
                    aria-label="Doctor's city"
                    aria-describedby="city-help"
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    value={personalInfo.province}
                    onChange={(e) => handlePersonalInfoChange("province", e.target.value)}
                    placeholder="Metro Manila"
                    aria-label="Doctor's province"
                    aria-describedby="province-help"
                  />
                </div>
              </div>
            </fieldset>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licenseNumber">PRC License Number *</Label>
                  <Input
                    id="licenseNumber"
                    value={professionalInfo.licenseNumber}
                    onChange={(e) => handleProfessionalInfoChange("licenseNumber", e.target.value)}
                    placeholder="0000000"
                    required
                    aria-label="Doctor's PRC license number"
                    aria-describedby="licenseNumber-help"
                    aria-required="true"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Medical Specialty *</Label>
                  <Select
                    value={professionalInfo.specialty}
                    onValueChange={(value) => handleProfessionalInfoChange("specialty", value)}
                  >
                    <SelectTrigger
                      aria-label="Doctor's medical specialty"
                      aria-describedby="specialty-help"
                      aria-required="true"
                    >
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subSpecialty">Sub-specialty</Label>
                  <Input
                    id="subSpecialty"
                    value={professionalInfo.subSpecialty}
                    onChange={(e) => handleProfessionalInfoChange("subSpecialty", e.target.value)}
                    placeholder="e.g., Interventional Cardiology"
                    aria-label="Doctor's sub-specialty"
                    aria-describedby="subSpecialty-help"
                  />
                </div>
                <div>
                  <Label htmlFor="yearsExperience">Years of Experience *</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    value={professionalInfo.yearsExperience}
                    onChange={(e) => handleProfessionalInfoChange("yearsExperience", e.target.value)}
                    placeholder="5"
                    required
                    aria-label="Doctor's years of experience"
                    aria-describedby="yearsExperience-help"
                    aria-required="true"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Education</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medicalSchool">Medical School *</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="medicalSchool"
                      value={professionalInfo.medicalSchool}
                      onChange={(e) => handleProfessionalInfoChange("medicalSchool", e.target.value)}
                      placeholder="University of the Philippines College of Medicine"
                      className="pl-10"
                      required
                      aria-label="Doctor's medical school"
                      aria-describedby="medicalSchool-help"
                      aria-required="true"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    value={professionalInfo.graduationYear}
                    onChange={(e) => handleProfessionalInfoChange("graduationYear", e.target.value)}
                    placeholder="2015"
                    aria-label="Doctor's graduation year"
                    aria-describedby="graduationYear-help"
                  />
                </div>
                <div>
                  <Label htmlFor="residencyHospital">Residency Hospital</Label>
                  <Input
                    id="residencyHospital"
                    value={professionalInfo.residencyHospital}
                    onChange={(e) => handleProfessionalInfoChange("residencyHospital", e.target.value)}
                    placeholder="Philippine General Hospital"
                    aria-label="Doctor's residency hospital"
                    aria-describedby="residencyHospital-help"
                  />
                </div>
                <div>
                  <Label htmlFor="residencyYear">Residency Completion Year</Label>
                  <Input
                    id="residencyYear"
                    type="number"
                    value={professionalInfo.residencyYear}
                    onChange={(e) => handleProfessionalInfoChange("residencyYear", e.target.value)}
                    placeholder="2019"
                    aria-label="Doctor's residency completion year"
                    aria-describedby="residencyYear-help"
                  />
                </div>
                <div>
                  <Label htmlFor="fellowshipProgram">Fellowship Program</Label>
                  <Input
                    id="fellowshipProgram"
                    value={professionalInfo.fellowshipProgram}
                    onChange={(e) => handleProfessionalInfoChange("fellowshipProgram", e.target.value)}
                    placeholder="Cardiology Fellowship"
                    aria-label="Doctor's fellowship program"
                    aria-describedby="fellowshipProgram-help"
                  />
                </div>
                <div>
                  <Label htmlFor="fellowshipYear">Fellowship Completion Year</Label>
                  <Input
                    id="fellowshipYear"
                    type="number"
                    value={professionalInfo.fellowshipYear}
                    onChange={(e) => handleProfessionalInfoChange("fellowshipYear", e.target.value)}
                    placeholder="2021"
                    aria-label="Doctor's fellowship completion year"
                    aria-describedby="fellowshipYear-help"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Current Practice</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentHospital">Current Hospital/Clinic</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="currentHospital"
                      value={professionalInfo.currentHospital}
                      onChange={(e) => handleProfessionalInfoChange("currentHospital", e.target.value)}
                      placeholder="St. Luke's Medical Center"
                      className="pl-10"
                      aria-label="Doctor's current hospital/clinic"
                      aria-describedby="currentHospital-help"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="currentPosition">Current Position</Label>
                  <Input
                    id="currentPosition"
                    value={professionalInfo.currentPosition}
                    onChange={(e) => handleProfessionalInfoChange("currentPosition", e.target.value)}
                    placeholder="Senior Consultant"
                    aria-label="Doctor's current position"
                    aria-describedby="currentPosition-help"
                  />
                </div>
                <div>
                  <Label htmlFor="consultationFee">Consultation Fee (PHP)</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    value={professionalInfo.consultationFee}
                    onChange={(e) => handleProfessionalInfoChange("consultationFee", e.target.value)}
                    placeholder="2000"
                    aria-label="Doctor's consultation fee"
                    aria-describedby="consultationFee-help"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
              <div className="space-y-4">
                <div>
                  <Label>Available Days</Label>
                  <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Select available days">
                    {daysOfWeek.map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={professionalInfo.availableDays.includes(day) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDayToggle(day)}
                        aria-pressed={professionalInfo.availableDays.includes(day)}
                        aria-label={`${day} ${professionalInfo.availableDays.includes(day) ? "selected" : "not selected"}`}
                        className="mb-2"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Available From</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={professionalInfo.availableHours.start}
                      onChange={(e) =>
                        setProfessionalInfo((prev) => ({
                          ...prev,
                          availableHours: {
                            ...prev.availableHours,
                            start: e.target.value,
                          },
                        }))
                      }
                      aria-label="Available from time"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Available Until</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={professionalInfo.availableHours.end}
                      onChange={(e) =>
                        setProfessionalInfo((prev) => ({
                          ...prev,
                          availableHours: {
                            ...prev.availableHours,
                            end: e.target.value,
                          },
                        }))
                      }
                      aria-label="Available until time"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Languages</h4>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Select languages spoken">
                {languages.map((language) => (
                  <Button
                    key={language}
                    type="button"
                    variant={professionalInfo.languages.includes(language) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLanguageToggle(language)}
                    aria-pressed={professionalInfo.languages.includes(language)}
                    aria-label={`${language} ${professionalInfo.languages.includes(language) ? "selected" : "not selected"}`}
                    className="mb-2"
                  >
                    {language}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={professionalInfo.bio}
                onChange={(e) => handleProfessionalInfoChange("bio", e.target.value)}
                placeholder="Brief description of your medical practice, expertise, and approach to patient care..."
                rows={4}
                aria-label="Doctor's professional bio"
                aria-describedby="bio-help"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Verification</h3>
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <p className="font-medium mb-2">Document Requirements:</p>
                  <ul className="text-sm space-y-1">
                    <li>• All documents must be clear, legible, and in PDF or image format</li>
                    <li>• Maximum file size: 10MB per document</li>
                    <li>• Documents will be verified by our medical team</li>
                    <li>• Processing time: 3-5 business days</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>

            <div className="grid gap-6">
              {requiredDocuments.map((doc) => (
                <Card
                  key={doc.key}
                  className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors"
                  role="region"
                  aria-labelledby={`doc-title-${doc.key}`}
                  aria-describedby={`doc-desc-${doc.key}`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 mb-4 sm:mb-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 id={`doc-title-${doc.key}`} className="font-medium text-gray-900">
                            {doc.title}
                          </h4>
                          {doc.required && (
                            <Badge variant="destructive" className="text-xs" aria-label="Required document">
                              Required
                            </Badge>
                          )}
                          {documents[doc.key as keyof typeof documents].uploaded && (
                            <Badge
                              variant="default"
                              className="text-xs bg-green-100 text-green-700"
                              aria-label="Document uploaded successfully"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                              Uploaded
                            </Badge>
                          )}
                        </div>
                        <p id={`doc-desc-${doc.key}`} className="text-sm text-gray-600 mb-4">
                          {doc.description}
                        </p>

                        {documents[doc.key as keyof typeof documents].preview && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                            {documents[doc.key as keyof typeof documents].file?.type.startsWith("image/") ? (
                              <img
                                src={documents[doc.key as keyof typeof documents].preview! || "/placeholder.svg"}
                                alt={`Preview of uploaded ${doc.title}`}
                                className="w-32 h-32 object-cover rounded-lg border"
                              />
                            ) : (
                              <div
                                className="w-32 h-32 bg-gray-100 rounded-lg border flex items-center justify-center"
                                role="img"
                                aria-label={`PDF document preview for ${doc.title}`}
                              >
                                <FileText className="h-8 w-8 text-gray-400" aria-hidden="true" />
                                <span className="text-xs text-gray-500 ml-2" aria-hidden="true">
                                  PDF
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-start sm:justify-end">
                        <input
                          type="file"
                          id={`file-${doc.key}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(doc.key, file)
                              setAnnouncement(`${doc.title} uploaded successfully`)
                            }
                          }}
                          className="sr-only"
                          aria-describedby={`file-help-${doc.key}`}
                        />
                        <div id={`file-help-${doc.key}`} className="sr-only">
                          Upload {doc.title}. Accepted formats: PDF, JPG, JPEG, PNG. Maximum size: 10MB.
                        </div>
                        <label htmlFor={`file-${doc.key}`}>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            asChild
                            aria-describedby={`file-help-${doc.key}`}
                          >
                            <span>
                              <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                              {documents[doc.key as keyof typeof documents].uploaded ? "Replace" : "Upload"}
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Agreements</h3>
              <Alert className="mb-6 bg-emerald-50 border-emerald-200">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800">
                  Please review and accept the following agreements to complete your registration.
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="termsOfService"
                      checked={agreements.termsOfService}
                      onCheckedChange={(checked) =>
                        setAgreements((prev) => ({ ...prev, termsOfService: checked as boolean }))
                      }
                      aria-describedby="terms-desc"
                    />
                    <div className="flex-1">
                      <Label htmlFor="termsOfService" className="font-medium text-gray-900 cursor-pointer">
                        Terms of Service *
                      </Label>
                      <p id="terms-desc" className="text-sm text-gray-600 mt-1">
                        I agree to the EveryHealthPH Terms of Service and understand my responsibilities as a healthcare
                        provider on the platform.
                      </p>
                      <Link href="/terms" className="text-sm text-blue-600 hover:underline">
                        Read Terms of Service →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacyPolicy"
                      checked={agreements.privacyPolicy}
                      onCheckedChange={(checked) =>
                        setAgreements((prev) => ({ ...prev, privacyPolicy: checked as boolean }))
                      }
                      aria-describedby="privacy-desc"
                    />
                    <div className="flex-1">
                      <Label htmlFor="privacyPolicy" className="font-medium text-gray-900 cursor-pointer">
                        Privacy Policy *
                      </Label>
                      <p id="privacy-desc" className="text-sm text-gray-600 mt-1">
                        I acknowledge that I have read and understand the Privacy Policy regarding patient data handling
                        and protection.
                      </p>
                      <Link href="/privacy" className="text-sm text-blue-600 hover:underline">
                        Read Privacy Policy →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="medicalEthics"
                      checked={agreements.medicalEthics}
                      onCheckedChange={(checked) =>
                        setAgreements((prev) => ({ ...prev, medicalEthics: checked as boolean }))
                      }
                      aria-describedby="ethics-desc"
                    />
                    <div className="flex-1">
                      <Label htmlFor="medicalEthics" className="font-medium text-gray-900 cursor-pointer">
                        Medical Ethics Code *
                      </Label>
                      <p id="ethics-desc" className="text-sm text-gray-600 mt-1">
                        I commit to upholding the highest standards of medical ethics and professional conduct in all
                        patient interactions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="dataSharing"
                      checked={agreements.dataSharing}
                      onCheckedChange={(checked) =>
                        setAgreements((prev) => ({ ...prev, dataSharing: checked as boolean }))
                      }
                      aria-describedby="data-desc"
                    />
                    <div className="flex-1">
                      <Label htmlFor="dataSharing" className="font-medium text-gray-900 cursor-pointer">
                        Data Sharing Agreement
                      </Label>
                      <p id="data-desc" className="text-sm text-gray-600 mt-1">
                        I consent to sharing anonymized medical data for research and platform improvement purposes
                        (optional).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <p className="font-medium mb-2">Application Review Process:</p>
                <ul className="text-sm space-y-1">
                  <li>• Your application will be reviewed by our medical verification team</li>
                  <li>• We may contact you for additional information or clarification</li>
                  <li>• Approval typically takes 3-5 business days</li>
                  <li>• You will receive email notifications about your application status</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="w-full px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="flex items-center">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 p-1 sm:p-2">
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                <span className="text-base sm:text-xl font-bold text-gray-900">EveryHealthPH</span>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                  Doctor Registration
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <ResponsiveContainer className="py-6 sm:py-8">
        {/* Progress Steps - Mobile Optimized */}
        <div
          className="mb-6 sm:mb-8"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Registration progress: ${getStepAriaLabel(currentStep)}`}
        >
          {/* Mobile Progress Bar */}
          <div className="block sm:hidden mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${getProgressPercentage()}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
          </div>

          {/* Desktop Progress Steps */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      step <= currentStep ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                    aria-label={`Step ${step}: ${step <= currentStep ? "Completed" : "Not completed"}`}
                    role="img"
                  >
                    {step < currentStep ? (
                      <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <span aria-hidden="true">{step}</span>
                    )}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-full h-1 mx-2 ${step < currentStep ? "bg-emerald-600" : "bg-gray-200"}`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
            <div
              className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600"
              role="list"
              aria-label="Registration steps"
            >
              <span role="listitem">Personal Info</span>
              <span role="listitem">Professional Info</span>
              <span role="listitem">Documents</span>
              <span role="listitem">Review & Submit</span>
            </div>
          </div>
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {getStepAriaLabel(currentStep)}. Progress: {getProgressPercentage()}% complete.
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle className="text-xl sm:text-2xl">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Professional Information"}
              {currentStep === 3 && "Document Verification"}
              {currentStep === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription className="text-sm">
              {currentStep === 1 && "Please provide your personal details"}
              {currentStep === 2 && "Tell us about your medical background and expertise"}
              {currentStep === 3 && "Upload required documents for verification"}
              {currentStep === 4 && "Review your information and complete registration"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-6 sm:px-6 sm:pb-8">
            {error && (
              <Alert variant="destructive" className="mb-6" role="alert">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50" role="alert">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {renderStepContent()}

            {/* Navigation Buttons - Mobile Optimized */}
            <nav
              className="flex justify-between mt-8 pt-6 border-t border-gray-200"
              aria-label="Registration navigation"
            >
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-3 sm:px-6"
                aria-label={
                  currentStep === 1
                    ? "Previous step (disabled, first step)"
                    : `Go to previous step: ${getStepAriaLabel(currentStep - 1)}`
                }
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  className="px-3 sm:px-6 bg-emerald-600 hover:bg-emerald-700"
                  aria-label={`Continue to next step: ${getStepAriaLabel(currentStep + 1)}`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ArrowLeft className="h-4 w-4 rotate-180 sm:ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-3 sm:px-6 bg-emerald-600 hover:bg-emerald-700"
                  aria-label="Submit doctor registration application"
                  aria-describedby="submit-help"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" aria-hidden="true" />
                      <span className="hidden sm:inline">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Submit Application</span>
                      <span className="inline sm:hidden">Submit</span>
                    </>
                  )}
                </Button>
              )}
              <div id="submit-help" className="sr-only">
                Clicking submit will send your application for review by our medical team
              </div>
            </nav>
          </CardContent>
        </Card>
        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true" role="status">
          {announcement}
        </div>
      </ResponsiveContainer>
    </div>
  )
}
