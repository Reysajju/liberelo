import { NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/paypal"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { campaignId, description } = body

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      )
    }

    // Verify campaign exists and is pending payment
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      include: { book: true },
    })

    if (campaign.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (campaign.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: "Campaign is not in pending payment state" },
        { status: 400 }
      )
    }

    // Security: Use amount from database, NOT from client body
    const amountToCharge = campaign.totalAmount || 0
    if (amountToCharge <= 0) {
      return NextResponse.json({ error: "Invalid campaign amount" }, { status: 400 })
    }

    // Create PayPal order
    const orderDescription = description || `Liberelo Campaign: ${campaign.book?.title || campaign.name || campaignId}`
    const order = await createOrder(amountToCharge, orderDescription, campaignId)

    // Store the PayPal order ID on the campaign
    await db.campaign.update({
      where: { id: campaignId },
      data: { paypalOrderId: order.id },
    })

    return NextResponse.json({ orderID: order.id })
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    )
  }
}
