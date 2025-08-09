"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/back-button"
import { Bot, Send, Loader2, MessageSquare, Brain } from 'lucide-react'
import { useChat } from "ai/react"
import Image from "next/image"

interface AsystentAISectionProps {
  onBack: () => void
}

export function AsystentAISection({ onBack }: AsystentAISectionProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  const exampleQueries = [
    "Jakie są terminy przedawnienia roszczeń z umowy pożyczki?",
    "Jak rozwiązać umowę o pracę za wypowiedzeniem?",
    "Jak odwołać się od decyzji urzędowej?",
    "Co powinna zawierać umowa najmu mieszkania?",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <BackButton onClick={onBack} />

        <div className="max-w-6xl mx-auto">
          {/* Hero (bez zdjęcia kobiety z wagą) */}
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-8 mb-6">
              <div className="relative w-20 h-20">
                <Image src="/images/brain-ai.png" alt="AI Brain" fill className="object-contain" />
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="relative w-20 h-20">
                <Image src="/images/ai-knowledge.png" alt="AI Knowledge" fill className="object-contain" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Asystent Prawny AI</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Odpowiedzi oparte o kontekst z polskiej bazy wiedzy (RAG)
            </p>
          </div>

          {/* Chat */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Czat z Asystentem
                  </CardTitle>
                  <CardDescription>Twoje pytanie zostanie wzbogacone kontekstem z bazy wiedzy</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[400px]">
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <Brain className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                        <p>Zadaj pierwsze pytanie, aby rozpocząć rozmowę</p>
                      </div>
                    )}
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Napisz pytanie prawne..."
                      className="flex-1 min-h-[60px] resize-none"
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} aria-label="Wyślij">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>

                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      To ogólna informacja prawna. Skonsultuj się z prawnikiem przed podjęciem decyzji.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Examples */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Przykładowe pytania</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exampleQueries.map((q) => (
                      <Badge
                        key={q}
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors w-full justify-start text-left p-2 h-auto"
                        onClick={() => (handleInputChange as any)({ target: { value: q } })}
                      >
                        {q}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
