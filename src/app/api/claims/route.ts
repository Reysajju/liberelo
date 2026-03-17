import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, reviewerId } = body

    if (!campaignId || !reviewerId) {
      return NextResponse.json({ error: "Campaign ID and Reviewer ID are required" }, { status: 400 })
    }

    // Check if already claimed
    const existingClaim = await db.claim.findUnique({
      where: {
        campaignId_reviewerId: {
          campaignId,
          reviewerId,
        },
      },
    })

    if (existingClaim) {
      return NextResponse.json({ error: "Already claimed this book" }, { status: 400 })
    }

    // Check if campaign has spots available
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      include: {
        _count: { select: { claims: true } },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (campaign._count.claims >= campaign.targetReviewCount) {
      return NextResponse.json({ error: "Campaign is full" }, { status: 400 })
    }

    const claim = await db.claim.create({
      data: {
        campaignId,
        reviewerId,
        status: "CLAIMED",
      },
      include: {
        campaign: {
          include: {
            book: true,
          },
        },
      },
    })

    return NextResponse.json(claim)
  } catch (error) {
    console.error("Error creating claim:", error)
    return NextResponse.json({ error: "Failed to claim book" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewerId = searchParams.get("reviewerId")

    const where = reviewerId ? { reviewerId } : {}

    const claims = await db.claim.findMany({
      where,
      include: {
        campaign: {
          include: {
            book: true,
          },
        },
      },
      orderBy: { claimedAt: "desc" },
    })

    return NextResponse.json({ claims })
  } catch (error) {
    console.error("Error fetching claims:", error)
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 })
  }
}
