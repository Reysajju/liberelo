import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, userType } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    let profile = await db.profile.findUnique({
      where: { email },
    })

    if (!profile) {
      // Create new user
      profile = await db.profile.create({
        data: {
          email,
          name: name || email.split("@")[0],
          userType: userType || "AUTHOR",
        },
      })
    }

    return NextResponse.json({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      userType: profile.userType,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
