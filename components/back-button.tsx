"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  onClick: () => void
  className?: string
}

export function BackButton({ onClick, className = "" }: BackButtonProps) {
  return (
    <Button variant="ghost" onClick={onClick} className={`mb-6 hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Powrót
    </Button>
  )
}
