"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Download,
  CheckCircle,
  Loader2,
  Star,
  Link as LinkIcon
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
      genre: string | null
      blurb: string | null
      coverImage: string | null
      amazonUrl: string | null
      manuscriptFile: string | null
      manuscriptType: string | null
    }
  }
}

interface LibraryPageProps {
  user: {
    id: string
    name: string | null
    email: string
    userType: string
  }
}

export function LibraryPage({ user }: LibraryPageProps) {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [reviewUrl, setReviewUrl] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchClaims()
  }, [user.id])

  const fetchClaims = async () => {
    try {
      const response = await fetch(`/api/claims?reviewerId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setClaims(data.claims || [])
      }
    } catch (error) {
      console.error("Error fetching claims:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysRemaining = (claimedAt: string) => {
    const claimDate = new Date(claimedAt)
    const deadline = new Date(claimDate.getTime() + 14 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    return Math.max(0, daysRemaining)
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

  const handleDownload = async (claim: Claim) => {
    await fetch(`/api/claims/${claim.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DOWNLOADED" }),
    })
    
    toast({
      title: "Download started",
      description: "Your manuscript is being prepared for download.",
    })
    
    fetchClaims()
  }

  const handleSubmitReview = async () => {
    if (!selectedClaim || !reviewUrl) return
    
    setSubmitting(true)
    try {
      const response = await fetch(`/api/claims/${selectedClaim.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "REVIEWED",
          reviewUrl: reviewUrl,
        }),
      })

      if (response.ok) {
        toast({
          title: "Review submitted!",
          description: "Thank you for your review. The author appreciates it!",
        })
        setSelectedClaim(null)
        setReviewUrl("")
        fetchClaims()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (claimId: string, status: string) => {
    await fetch(`/api/claims/${claimId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    fetchClaims()
  }

  const pendingClaims = claims.filter(c => c.status !== "REVIEWED" && c.status !== "GHOSTED")
  const completedClaims = claims.filter(c => c.status === "REVIEWED")

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

  const ClaimCard = ({ claim }: { claim: Claim }) => {
    const daysRemaining = getDaysRemaining(claim.claimedAt)
    const isUrgent = daysRemaining <= 3 && daysRemaining > 0
    const isOverdue = daysRemaining === 0 && claim.status !== "REVIEWED"

    return (
      <div className={`rounded-xl border bg-white/5 p-5 transition-all ${
        isOverdue ? 'border-rose-500/50' : 'border-white/10 hover:border-violet-500/50'
      }`}>
        <div className="flex gap-4">
          {/* Book Cover */}
          <div className="h-28 w-20 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden">
            {claim.campaign.book.coverImage ? (
              <img 
                src={claim.campaign.book.coverImage} 
                alt={claim.campaign.book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <BookOpen className="h-8 w-8 text-white/20" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-white">{claim.campaign.book.title}</h3>
                <p className="text-sm text-white/40">by {claim.campaign.book.author}</p>
              </div>
              <Badge variant="outline" className={getStatusColor(claim.status)}>
                {claim.status.toLowerCase()}
              </Badge>
            </div>

            {claim.campaign.book.genre && (
              <Badge variant="outline" className="bg-white/5 text-white/50 border-white/10 mb-3">
                {claim.campaign.book.genre}
              </Badge>
            )}

            {/* Countdown */}
            {claim.status !== "REVIEWED" && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className={`h-4 w-4 ${isUrgent || isOverdue ? 'text-rose-400' : 'text-white/30'}`} />
                  <span className={`text-sm ${isUrgent || isOverdue ? 'text-rose-400 font-medium' : 'text-white/40'}`}>
                    {isOverdue ? "Overdue!" : `${daysRemaining} days remaining`}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${isUrgent || isOverdue ? 'bg-rose-500' : 'bg-violet-500'}`}
                    style={{ width: `${((14 - daysRemaining) / 14) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {claim.campaign.campaignType === "PRE_LAUNCH" && claim.campaign.book.manuscriptFile && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => handleDownload(claim)}
                >
                  <Download className="mr-2 h-3 w-3" />
                  Download {claim.campaign.book.manuscriptType}
                </Button>
              )}

              {claim.campaign.book.amazonUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => window.open(claim.campaign.book.amazonUrl!, '_blank')}
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  View on Amazon
                </Button>
              )}

              {claim.status !== "REVIEWED" && (
                <>
                  {claim.status === "DOWNLOADED" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => handleUpdateStatus(claim.id, "READING")}
                    >
                      Mark as Reading
                    </Button>
                  )}
                  <Button 
                    size="sm"
                    className="h-8 bg-white text-black font-medium hover:bg-white/90"
                    onClick={() => {
                      setSelectedClaim(claim)
                      setReviewUrl(claim.reviewUrl || "")
                    }}
                  >
                    <CheckCircle className="mr-2 h-3 w-3" />
                    Submit Review
                  </Button>
                </>
              )}

              {claim.status === "REVIEWED" && claim.reviewUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => window.open(claim.reviewUrl!, '_blank')}
                >
                  <LinkIcon className="mr-2 h-3 w-3" />
                  View Your Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20 pointer-events-none" />
      
      <div className="relative container px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">My Library</h1>
          <p className="text-white/40">Manage your claimed books and submit your reviews.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Total Claimed" value={claims.length} />
          <StatCard icon={Clock} label="Need Review" value={pendingClaims.length} />
          <StatCard icon={CheckCircle} label="Completed" value={completedClaims.length} accent />
          <StatCard icon={Star} label="Completion Rate" value={`${((completedClaims.length / Math.max(claims.length, 1)) * 100).toFixed(0)}%`} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg"
            >
              Pending ({pendingClaims.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg"
            >
              Completed ({completedClaims.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-white/30" />
              <p className="text-white/40 mt-4">Loading your library...</p>
            </div>
          ) : (
            <>
              <TabsContent value="pending" className="space-y-4">
                {pendingClaims.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
                    <BookOpen className="h-12 w-12 mx-auto text-white/20 mb-4" />
                    <h3 className="font-medium text-white mb-2">No Pending Reviews</h3>
                    <p className="text-sm text-white/40">Discover new books to claim and review.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingClaims.map((claim) => (
                      <ClaimCard key={claim.id} claim={claim} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedClaims.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
                    <CheckCircle className="h-12 w-12 mx-auto text-white/20 mb-4" />
                    <h3 className="font-medium text-white mb-2">No Completed Reviews</h3>
                    <p className="text-sm text-white/40">Your completed reviews will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedClaims.map((claim) => (
                      <ClaimCard key={claim.id} claim={claim} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Submit Review Dialog */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="bg-zinc-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Submit Your Review</DialogTitle>
            <DialogDescription className="text-white/50">
              Paste the link to your review on Amazon, Goodreads, or your blog.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewUrl" className="text-white/70">Review URL</Label>
              <Input
                id="reviewUrl"
                placeholder="https://amazon.com/review/..."
                value={reviewUrl}
                onChange={(e) => setReviewUrl(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
            
            {selectedClaim && (
              <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                <p className="text-sm font-medium text-white">{selectedClaim.campaign.book.title}</p>
                <p className="text-xs text-white/40">by {selectedClaim.campaign.book.author}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedClaim(null)}
              className="text-white/50 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              className="bg-white text-black font-medium hover:bg-white/90"
              onClick={handleSubmitReview}
              disabled={!reviewUrl || submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
