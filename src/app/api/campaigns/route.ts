import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      bookId,
      authorId,
      campaignType,
      targetReviewCount,
      name,
      description,
      totalAmount,
    } = body

    if (!bookId || !authorId) {
      return NextResponse.json({ error: "Book ID and Author ID are required" }, { status: 400 })
    }

    const campaign = await db.campaign.create({
      data: {
        bookId,
        authorId,
        campaignType: campaignType || "POST_LAUNCH",
        targetReviewCount: targetReviewCount || 50,
        name: name || null,
        description: description || null,
        totalAmount: totalAmount || 0,
        status: "PENDING_PAYMENT", // Campaign stays pending until PayPal payment is captured
      },
      include: {
        book: true,
      },
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get("authorId")

    const where = authorId ? { authorId } : {}

    const campaigns = await db.campaign.findMany({
      where,
      include: {
        book: true,
        claims: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            claims: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}
