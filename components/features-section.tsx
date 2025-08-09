"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, FileSearch, Scale, Users, Zap, Clock, ArrowRight, CheckCircle, Shield, FileText, Lock } from 'lucide-react'
import Image from "next/image"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Zgodność i rzetelność",
      desc: "Odpowiedzi oparte o sprawdzone źródła, z jasnym zastrzeżeniem weryfikacji prawnej.",
    },
    { icon: Clock, title: "Szybkość działania", desc: "Natychmiastowe wyniki bez oczekiwania i zbędnych kroków." },
    { icon: FileText, title: "Dokumenty", desc: "Tworzenie i zarządzanie pismami w jednym miejscu." },
    { icon: Lock, title: "Bezpieczeństwo", desc: "Ochrona danych z wykorzystaniem najlepszych praktyk." }
  ]

  const stats = [
    { label: "Kancelarii korzysta", value: "500+", icon: Users },
    { label: "Dokumentów przeanalizowano", value: "50k+", icon: FileSearch },
    { label: "Zapytań AI dziennie", value: "10k+", icon: Bot },
    { label: "Średni czas oszczędności", value: "4h", icon: Clock },
  ]

  return (
    <section className="bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">Dlaczego LegalNexus?</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-md transition-shadow"
            >
              <f.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
