import { NextRequest, NextResponse } from "next/server"
import { captureOrder } from "@/lib/paypal"
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
    const { orderID, campaignId } = body

    if (!orderID || !campaignId) {
      return NextResponse.json(
        { error: "Order ID and Campaign ID are required" },
        { status: 400 }
      )
    }

    // Verify the campaign exists and is pending
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (campaign.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (campaign.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: "Campaign is not in pending payment state" },
        { status: 400 }
      )
    }

    // Capture the PayPal payment
    const captureData = await captureOrder(orderID)

    if (captureData.status === "COMPLETED") {
      // Extract capture ID from the first purchase unit
      const captureId =
        captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id || null

      // Activate the campaign and store PayPal transaction details
      await db.campaign.update({
        where: { id: campaignId },
        data: {
          status: "ACTIVE",
          paypalOrderId: orderID,
          paypalCaptureId: captureId,
        },
      })

      return NextResponse.json({
        success: true,
        status: "COMPLETED",
        captureId,
      })
    } else {
      return NextResponse.json(
        { 
          error: "Payment not completed",
          status: captureData.status,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error capturing PayPal order:", error)
    return NextResponse.json(
      { error: "Failed to capture PayPal payment" },
      { status: 500 }
    )
  }
}
