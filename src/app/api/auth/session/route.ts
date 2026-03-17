import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user?.email) {
      return NextResponse.json({ user: null })
    }

    // Get the Prisma profile that matches the Supabase user
    const profile = await db.profile.findUnique({
      where: { email: session.user.email },
    })

    if (!profile) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: profile })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null })
  }
}
