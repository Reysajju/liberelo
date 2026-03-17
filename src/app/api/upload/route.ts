import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const bookId = formData.get("bookId") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${originalName}`
    const filepath = path.join(uploadsDir, filename)

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Update book with manuscript info
    const manuscriptType = file.name.split(".").pop()?.toUpperCase() || "PDF"
    
    if (bookId) {
      await db.book.update({
        where: { id: bookId },
        data: {
          manuscriptFile: `/uploads/${filename}`,
          manuscriptType,
        },
      })
    }

    return NextResponse.json({
      success: true,
      path: `/uploads/${filename}`,
      type: manuscriptType,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
