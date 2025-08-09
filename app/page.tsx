"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { AsystentAISection } from "@/components/sections/asystent-ai-section"
import { BlogSection } from "@/components/sections/blog-section"
import { PoradnikiSection } from "@/components/sections/poradniki-section"

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState("home")

  const handleNavigate = (section: string) => {
    setCurrentSection(section)
  }

  const handleBack = () => {
    setCurrentSection("home")
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "asystent-ai":
        return <AsystentAISection onBack={handleBack} />
      case "blog":
        return <BlogSection onBack={handleBack} />
      case "poradniki":
        return <PoradnikiSection onBack={handleBack} />
      default:
        return (
          <>
            <HeroSection />
            <FeaturesSection />
            <StatsSection />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header onNavigate={handleNavigate} currentSection={currentSection} showMenuButton={true} />
      {renderCurrentSection()}
    </div>
  )
}
