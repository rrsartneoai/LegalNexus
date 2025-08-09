import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const type = formData.get("type") as string
    const recipientName = formData.get("recipientName") as string
    const recipientAddress = formData.get("recipientAddress") as string

    // Save document to database
    const { data: document, error } = await supabase
      .from("legal_documents")
      .insert([
        {
          user_id: session.user.id,
          title,
          content,
          type,
          recipient_name: recipientName,
          recipient_address: recipientAddress,
          status: "draft",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error saving document:", error)
      return NextResponse.json({ error: "Failed to save document" }, { status: 500 })
    }

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error("Error in documents API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: documents, error } = await supabase
      .from("legal_documents")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching documents:", error)
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Error in documents API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
