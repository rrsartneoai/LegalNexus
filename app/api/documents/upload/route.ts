import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`
    const filePath = `documents/${session.user.id}/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from("documents").upload(filePath, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(filePath)

    // Create document record in database
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert([
        {
          name: title || file.name,
          description: description || "",
          file_path: filePath,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          status: "uploaded",
          user_id: session.user.id,
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      // Clean up uploaded file if database insert fails
      await supabase.storage.from("documents").remove([filePath])
      return NextResponse.json({ error: "Failed to save document record" }, { status: 500 })
    }

    // Create processing task record
    const { data: task, error: taskError } = await supabase
      .from("processing_tasks")
      .insert([
        {
          document_id: document.id,
          user_id: session.user.id,
          status: "pending",
          task_type: "document_analysis",
        },
      ])
      .select()
      .single()

    if (taskError) {
      console.error("Task creation error:", taskError)
    }

    return NextResponse.json({
      success: true,
      documentId: document.id,
      taskId: task?.id,
      message: "Document uploaded successfully",
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
