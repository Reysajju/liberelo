import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      author,
      genre,
      blurb,
      isbn,
      status,
      releaseDate,
      amazonUrl,
      appleBooksUrl,
      kindleUnlimited,
      authorId,
    } = body

    if (!title || !author) {
      return NextResponse.json({ error: "Title and author are required" }, { status: 400 })
    }

    const book = await db.book.create({
      data: {
        title,
        author,
        genre: genre || null,
        blurb: blurb || null,
        isbn: isbn || null,
        status: status || "DRAFT",
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        amazonUrl: amazonUrl || null,
        appleBooksUrl: appleBooksUrl || null,
        kindleUnlimited: kindleUnlimited || false,
        authorId: authorId || "default-author",
      },
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get("authorId")

    const where = authorId ? { authorId } : {}

    const books = await db.book.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ books })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}
