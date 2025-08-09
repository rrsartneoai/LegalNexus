import { generateLegalResponse } from "@/lib/gemini"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { question, context, language = "pl" } = await request.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const response = await generateLegalResponse({
      question,
      context,
      language,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in legal query API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
