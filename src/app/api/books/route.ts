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
      authorId: providedAuthorId,
      email,
      phone,
    } = body

    let authorId = providedAuthorId

    // If no authorId is provided but email is, find or create a profile
    // This is for guest authors launching campaigns
    if (!authorId && email) {
      let profile = await db.profile.findUnique({
        where: { email },
      })

      if (!profile) {
        profile = await db.profile.create({
          data: {
            email,
            phone,
            name: author || email.split("@")[0],
            userType: "AUTHOR",
          },
        })
      }
      authorId = profile.id
    }

    if (!title || !author || !authorId) {
      return NextResponse.json({ error: "Title, author, and author ID (or email) are required" }, { status: 400 })
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
        authorId,
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
