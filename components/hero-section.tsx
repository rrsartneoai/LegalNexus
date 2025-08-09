"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Kancelaria X – Inteligentna Platforma Prawna
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Szybkie odpowiedzi, zarządzanie dokumentami i wsparcie AI – wszystko w jednym miejscu. Bez zbędnych
              rozpraszaczy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href="#asystent-ai" onClick={(e) => e.preventDefault()}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Przejdź do Asystenta AI
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/pisma-prawne">
                  <FileText className="h-4 w-4 mr-2" />
                  Utwórz pismo
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800">
              <Image
                src="/images/digital-gavel.png"
                alt="Młotek sędziowski – cyfrowa transformacja prawa"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800">
              <Image src="/images/ai-knowledge.png" alt="AI Knowledge" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
