"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  links: {
    href: string
    label: string
    icon?: React.ReactNode
    variant?: "default" | "ghost" | "outline"
  }[]
  className?: string
  title?: string
}

export function MobileMenu({ links, className, title = "Menu" }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("md:hidden", className)} aria-label="Open mobile menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] max-w-sm">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-3">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors",
                "text-gray-700 hover:text-gray-900",
              )}
            >
              {link.icon && <span className="mr-3">{link.icon}</span>}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
