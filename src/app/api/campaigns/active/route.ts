import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const campaigns = await db.campaign.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        book: true,
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
    console.error("Error fetching active campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}
