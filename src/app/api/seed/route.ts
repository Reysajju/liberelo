import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST() {
  try {
    // Check if we already have data
    const existingProfiles = await db.profile.count()
    if (existingProfiles > 0) {
      return NextResponse.json({ message: "Database already seeded" })
    }

    // Create demo author
    const author = await db.profile.create({
      data: {
        id: "demo-author",
        email: "author@wadsworth.com",
        name: "Sarah Mitchell",
        userType: "BOTH",
        bio: "Bestselling author of fantasy and science fiction novels.",
        authorBio: "Award-winning author with over 20 published novels.",
      },
    })

    // Create demo reviewer
    const reviewer = await db.profile.create({
      data: {
        id: "demo-reviewer",
        email: "reviewer@wadsworth.com",
        name: "Alex Rivera",
        userType: "REVIEWER",
        bio: "Avid reader and reviewer. Love fantasy, sci-fi, and mystery genres.",
        preferredGenres: JSON.stringify(["Fantasy", "Science Fiction", "Mystery"]),
        amazonProfileUrl: "https://amazon.com/gp/profile/demo",
        reviewerRating: 4.9,
        totalReviewsGiven: 47,
      },
    })

    // Create additional reviewers
    const reviewer2 = await db.profile.create({
      data: {
        id: "demo-reviewer-2",
        email: "jamie@wadsworth.com",
        name: "Jamie Chen",
        userType: "REVIEWER",
        bio: "Book blogger and reviewer. Always looking for the next great read.",
        preferredGenres: JSON.stringify(["Romance", "Contemporary", "Thriller"]),
        reviewerRating: 4.7,
        totalReviewsGiven: 32,
      },
    })

    // Create demo books
    const book1 = await db.book.create({
      data: {
        id: "demo-book-1",
        title: "The Ember Crown",
        author: "Sarah Mitchell",
        authorId: author.id,
        genre: "Fantasy",
        blurb: "In a kingdom where fire magic is forbidden, one young woman discovers she holds the power to change everything. Princess Lyria must navigate court intrigue, forbidden romance, and a prophecy that could destroy everything she loves.",
        status: "PUBLISHED",
        amazonUrl: "https://amazon.com/dp/demo-ember-crown",
        kindleUnlimited: true,
      },
    })

    const book2 = await db.book.create({
      data: {
        id: "demo-book-2",
        title: "Starfall Chronicles: Awakening",
        author: "Sarah Mitchell",
        authorId: author.id,
        genre: "Science Fiction",
        blurb: "When humanity's first colony ship awakens from cryosleep, they find themselves in an uncharted sector of space. Captain Elena Vasquez must lead her crew through alien territories while uncovering the mystery of what happened to Earth.",
        status: "PRE_LAUNCH",
        releaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        manuscriptFile: "/uploads/demo-manuscript.pdf",
        manuscriptType: "PDF",
      },
    })

    const book3 = await db.book.create({
      data: {
        id: "demo-book-3",
        title: "Midnight in Vienna",
        author: "Sarah Mitchell",
        authorId: author.id,
        genre: "Mystery",
        blurb: "A chilling murder in 1920s Vienna draws Detective Klaus Müller into a web of secrets, art theft, and political intrigue. As he unravels the truth, he discovers that some secrets are worth killing for.",
        status: "PUBLISHED",
        amazonUrl: "https://amazon.com/dp/demo-midnight-vienna",
        kindleUnlimited: false,
      },
    })

    // Create campaigns
    const campaign1 = await db.campaign.create({
      data: {
        id: "demo-campaign-1",
        bookId: book1.id,
        authorId: author.id,
        campaignType: "POST_LAUNCH",
        targetReviewCount: 50,
        name: "Ember Crown Launch Campaign",
        description: "Looking for honest reviews for the first book in my fantasy trilogy. Perfect for fans of Sarah J. Maas and Jennifer L. Armentrout!",
        totalAmount: 29,
        status: "ACTIVE",
      },
    })

    const campaign2 = await db.campaign.create({
      data: {
        id: "demo-campaign-2",
        bookId: book2.id,
        authorId: author.id,
        campaignType: "PRE_LAUNCH",
        targetReviewCount: 100,
        name: "Starfall ARC Distribution",
        description: "Get an exclusive early copy of my new sci-fi novel! Looking for detailed reviews to post on launch day.",
        totalAmount: 89,
        status: "ACTIVE",
      },
    })

    const campaign3 = await db.campaign.create({
      data: {
        id: "demo-campaign-3",
        bookId: book3.id,
        authorId: author.id,
        campaignType: "POST_LAUNCH",
        targetReviewCount: 25,
        name: "Midnight Vienna Boost",
        description: "Help boost visibility for my historical mystery novel!",
        totalAmount: 19,
        status: "ACTIVE",
      },
    })

    // Create some claims
    await db.claim.create({
      data: {
        id: "demo-claim-1",
        campaignId: campaign1.id,
        reviewerId: reviewer.id,
        status: "REVIEWED",
        reviewUrl: "https://amazon.com/gp/customer-reviews/demo1",
        reviewPostedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        claimedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
    })

    await db.claim.create({
      data: {
        id: "demo-claim-2",
        campaignId: campaign1.id,
        reviewerId: reviewer2.id,
        status: "READING",
        claimedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    })

    await db.claim.create({
      data: {
        id: "demo-claim-3",
        campaignId: campaign2.id,
        reviewerId: reviewer.id,
        status: "DOWNLOADED",
        claimedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({
      message: "Database seeded successfully",
      data: {
        profiles: 3,
        books: 3,
        campaigns: 3,
        claims: 3,
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
