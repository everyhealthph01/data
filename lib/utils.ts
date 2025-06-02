import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions with default parameters to prevent "Expected 2-3 arguments" errors
export function formatCurrency(amount = 0, currency = "PHP"): string {
  try {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: currency,
    }).format(amount)
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function formatDate(date: Date | string = new Date(), options: Intl.DateTimeFormatOptions = {}): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    }).format(dateObj)
  } catch (error) {
    return "Invalid Date"
  }
}

export function formatTime(date: Date | string = new Date()): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(dateObj)
  } catch (error) {
    return "Invalid Time"
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 300,
  immediate = false,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit = 300): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function validateEmail(email = ""): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone = ""): boolean {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export function capitalizeFirst(str = ""): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncateText(text = "", maxLength = 100): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}
