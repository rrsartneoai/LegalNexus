import { NextResponse } from "next/server"
import { streamText } from "ai"
import { geminiModel } from "@/lib/gemini"
import { buildSystemPrompt, retrieveTopK } from "@/lib/rag"

// POST /api/chat - streaming chat with RAG
export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Expect { messages: [{ role: "user" | "assistant" | "system", content: string }, ...] }
    const messages = (body?.messages ?? []) as Array<{ role: string; content: string }>

    // last user question
    const lastUser = [...messages].reverse().find((m) => m.role === "user")
    const question = lastUser?.content?.slice(0, 4000) || "Brak pytania."
    const language: "pl" | "en" = /[ąćęłńóśźż]/i.test(question) ? "pl" : "en"

    // Retrieval
    const contexts = retrieveTopK(question, 3)
    const system = buildSystemPrompt(language, contexts)

    const result = await streamText({
      model: geminiModel,
      system,
      prompt: question,
      // Keep tokens generous but safe
      maxTokens: 900,
    })

    return result.toAIStreamResponse()
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Chat error" }, { status: 500 })
  }
}
