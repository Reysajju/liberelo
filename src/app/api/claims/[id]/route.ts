import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ClaimStatus } from "@prisma/client"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, reviewUrl } = body

    const updateData: {
      status?: ClaimStatus
      reviewUrl?: string
      reviewPostedAt?: Date
    } = {}

    if (status) {
      updateData.status = status
    }

    if (reviewUrl) {
      updateData.reviewUrl = reviewUrl
      updateData.reviewPostedAt = new Date()
    }

    const claim = await db.claim.update({
      where: { id },
      data: updateData,
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
    console.error("Error updating claim:", error)
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 })
  }
}
