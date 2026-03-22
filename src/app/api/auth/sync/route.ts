import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Verify the caller is actually authenticated in Supabase
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email } = body

    // Extra check to ensure they are syncing their own profile
    if (email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let profile = await db.profile.findUnique({
      where: { email },
    })

    // If profile doesn't exist but they are logged in via Supabase, create it
    if (!profile) {
      profile = await db.profile.create({
        data: {
          email: session.user.email,
          name: session.user.user_metadata?.full_name || email.split("@")[0],
          userType: session.user.user_metadata?.user_type || "AUTHOR",
        },
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
  }
}
