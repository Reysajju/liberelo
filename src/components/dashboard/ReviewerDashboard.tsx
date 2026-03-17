"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/stores/app-store"
import { 
  BookOpen, 
  Star, 
  Clock, 
  Trophy,
  Calendar,
  ExternalLink,
  ArrowRight
} from "lucide-react"

interface Claim {
  id: string
  status: string
  claimedAt: string
  reviewUrl: string | null
  campaign: {
    id: string
    campaignType: string
    book: {
      id: string
      title: string
      author: string
      coverImage: string | null
      amazonUrl: string | null
    }
  }
}

interface ReviewerDashboardProps {
  user: {
    id: string
    name: string | null
    email: string
    userType: string
    totalReviewsGiven?: number
    reviewerRating?: number
  }
}

export function ReviewerDashboard({ user }: ReviewerDashboardProps) {
  const { setCurrentView } = useAppStore()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClaims: 0,
    completedReviews: 0,
    pendingReviews: 0,
    reviewerRating: user.reviewerRating || 4.8,
  })

  useEffect(() => {
    fetchClaims()
  }, [user.id])

  const fetchClaims = async () => {
    try {
      const response = await fetch(`/api/claims?reviewerId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setClaims(data.claims || [])
        
        const completed = data.claims?.filter((c: Claim) => c.status === "REVIEWED").length || 0
        setStats({
          totalClaims: data.claims?.length || 0,
          completedReviews: completed,
          pendingReviews: (data.claims?.length || 0) - completed,
          reviewerRating: user.reviewerRating || 4.8,
        })
      }
    } catch (error) {
      console.error("Error fetching claims:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const styles: Record<string, string> = {
      CLAIMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      DOWNLOADED: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      READING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      REVIEWED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      GHOSTED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    }
    return styles[status] || "bg-white/5 text-white/50 border-white/10"
  }

  const getDaysRemaining = (claimedAt: string) => {
    const claimDate = new Date(claimedAt)
    const deadline = new Date(claimDate.getTime() + 14 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    return Math.max(0, daysRemaining)
  }

  const pendingClaims = claims.filter(c => c.status !== "REVIEWED" && c.status !== "GHOSTED")

  const StatCard = ({ icon: Icon, label, value, accent }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number;
    accent?: boolean;
  }) => (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${accent ? 'bg-violet-500/10' : 'bg-white/5'}`}>
          <Icon className={`h-4 w-4 ${accent ? 'text-violet-400' : 'text-white/50'}`} />
        </div>
      </div>
      <div className={`text-2xl font-semibold mb-1 ${accent ? 'text-violet-400' : 'text-white'}`}>{value}</div>
      <div className="text-sm text-white/40">{label}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20 pointer-events-none" />
      
      <div className="relative container px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">
            Welcome back, {user.name || "Reviewer"}
          </h1>
          <p className="text-white/40">Discover new books and share your reviews.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Books Claimed" value={stats.totalClaims} />
          <StatCard icon={Star} label="Reviews Given" value={stats.completedReviews} accent />
          <StatCard icon={Clock} label="Need Review" value={stats.pendingReviews} />
          <StatCard icon={Trophy} label="Rating" value={`${stats.reviewerRating.toFixed(1)} ★`} />
        </div>

        {/* Quick Action */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5">
                <BookOpen className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Discover New Books</h3>
                <p className="text-sm text-white/50">Find your next great read from our collection</p>
              </div>
            </div>
            <Button 
              className="bg-white text-black font-medium hover:bg-white/90 rounded-xl"
              onClick={() => setCurrentView("discover")}
            >
              Browse Books
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            Pending Reviews ({pendingClaims.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 text-white/40">Loading...</div>
          ) : pendingClaims.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-white/10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-4">
                <BookOpen className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="font-medium text-white mb-2">No Pending Reviews</h3>
              <p className="text-sm text-white/40 mb-6">Discover new books to read and review</p>
              <Button 
                onClick={() => setCurrentView("discover")}
                className="bg-white text-black font-medium hover:bg-white/90 rounded-xl"
              >
                Browse Books
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {pendingClaims.slice(0, 4).map((claim) => {
                const daysRemaining = getDaysRemaining(claim.claimedAt)
                const isUrgent = daysRemaining <= 3 && daysRemaining > 0
                
                return (
                  <div 
                    key={claim.id}
                    className="group rounded-xl border border-white/10 bg-white/5 p-5 hover:border-violet-500/50 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Book Cover */}
                      <div className="h-24 w-16 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden">
                        {claim.campaign.book.coverImage ? (
                          <img 
                            src={claim.campaign.book.coverImage} 
                            alt={claim.campaign.book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white/20" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-medium text-white truncate">{claim.campaign.book.title}</h3>
                            <p className="text-sm text-white/40 truncate">by {claim.campaign.book.author}</p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(claim.status)}>
                            {claim.status.toLowerCase()}
                          </Badge>
                        </div>

                        {/* Countdown */}
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className={`h-4 w-4 ${isUrgent ? 'text-rose-400' : 'text-white/30'}`} />
                          <span className={`text-sm ${isUrgent ? 'text-rose-400 font-medium' : 'text-white/40'}`}>
                            {daysRemaining} days remaining
                          </span>
                        </div>

                        <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-3">
                          <div 
                            className={`h-full rounded-full transition-all ${isUrgent ? 'bg-rose-500' : 'bg-violet-500'}`}
                            style={{ width: `${((14 - daysRemaining) / 14) * 100}%` }}
                          />
                        </div>

                        {claim.campaign.book.amazonUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-white/50 hover:text-white hover:bg-white/5"
                            onClick={() => window.open(claim.campaign.book.amazonUrl!, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            View on Amazon
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {pendingClaims.length > 4 && (
            <div className="text-center mt-4">
              <Button 
                variant="ghost" 
                className="text-white/50 hover:text-white"
                onClick={() => setCurrentView("library")}
              >
                View All ({pendingClaims.length})
              </Button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
          {claims.filter(c => c.status === "REVIEWED").length === 0 ? (
            <div className="text-center py-8 rounded-2xl border border-dashed border-white/10">
              <p className="text-sm text-white/40">Your completed reviews will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {claims
                .filter(c => c.status === "REVIEWED")
                .slice(0, 3)
                .map((claim) => (
                  <div 
                    key={claim.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 bg-white/5 rounded overflow-hidden">
                        {claim.campaign.book.coverImage ? (
                          <img 
                            src={claim.campaign.book.coverImage} 
                            alt={claim.campaign.book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-white/20" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{claim.campaign.book.title}</p>
                        <p className="text-xs text-white/40">Review completed</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      <Star className="h-3 w-3 mr-1" />
                      Reviewed
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
