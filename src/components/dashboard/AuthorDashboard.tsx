"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/stores/app-store"
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  Star, 
  Clock,
  ArrowRight,
  TrendingUp
} from "lucide-react"

interface Campaign {
  id: string
  name: string | null
  status: string
  campaignType: string
  targetReviewCount: number
  createdAt: string
  tier?: string
  book: {
    id: string
    title: string
    author: string
    coverImage: string | null
    status: string
  }
  claims: Array<{
    id: string
    status: string
  }>
  _count?: {
    claims: number
  }
}

interface AuthorDashboardProps {
  user: {
    id: string
    name: string | null
    email: string
    userType: string
  }
}

export function AuthorDashboard({ user }: AuthorDashboardProps) {
  const { setCurrentView, setSelectedCampaignId } = useAppStore()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalReach: 0,
    totalClaims: 0,
    totalReviews: 0,
  })

  useEffect(() => {
    fetchCampaigns()
  }, [user.id])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`/api/campaigns?authorId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns || [])
        
        // Calculate stats based on reach, not guaranteed reviews
        const totalReach = data.campaigns?.reduce((acc: number, c: Campaign) => {
          // Estimate reach based on tier
          const reachMap: Record<string, number> = { starter: 500, pro: 5000, publisher: 15000 }
          return acc + (reachMap[c.tier || 'starter'] || c.targetReviewCount)
        }, 0) || 0
        
        const totalClaims = data.campaigns?.reduce((acc: number, c: Campaign) => acc + (c._count?.claims || 0), 0) || 0
        const totalReviews = data.campaigns?.reduce((acc: number, c: Campaign) => 
          acc + c.claims?.filter((cl: { status: string }) => cl.status === "REVIEWED").length, 0) || 0
        
        setStats({
          totalCampaigns: data.campaigns?.length || 0,
          totalReach,
          totalClaims,
          totalReviews,
        })
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      PENDING_PAYMENT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      COMPLETED: "bg-white/5 text-white/50 border-white/10",
      PAUSED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    }
    return styles[status] || "bg-white/5 text-white/50 border-white/10"
  }

  const getCampaignTypeBadge = (type: string) => {
    return type === "PRE_LAUNCH" 
      ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
      : "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20"
  }

  const getTierBadge = (tier?: string) => {
    const styles: Record<string, string> = {
      starter: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      pro: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      publisher: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
    }
    return styles[tier || 'starter'] || "bg-white/5 text-white/50 border-white/10"
  }

  const StatCard = ({ icon: Icon, label, value, sublabel }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number;
    sublabel?: string;
  }) => (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-white/5">
          <Icon className="h-4 w-4 text-white/50" />
        </div>
      </div>
      <div className="text-2xl font-semibold text-white mb-1">{value}</div>
      <div className="text-sm text-white/40">{label}</div>
      {sublabel && <div className="text-xs text-white/30 mt-1">{sublabel}</div>}
    </div>
  )

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const claims = campaign._count?.claims || 0
    const reviews = campaign.claims?.filter(c => c.status === "REVIEWED").length || 0

    return (
      <div 
        className="group rounded-xl border border-white/10 bg-white/5 p-5 hover:border-violet-500/50 transition-all duration-300 cursor-pointer"
        onClick={() => {
          setSelectedCampaignId(campaign.id)
          setCurrentView("campaign-detail")
        }}
      >
        <div className="flex gap-4">
          {/* Book Cover */}
          <div className="h-28 w-20 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden">
            {campaign.book.coverImage ? (
              <img 
                src={campaign.book.coverImage} 
                alt={campaign.book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white/20" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-medium text-white truncate">{campaign.book.title}</h3>
                <p className="text-sm text-white/40">by {campaign.book.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant="outline" className={getStatusBadge(campaign.status)}>
                {campaign.status.replace("_", " ")}
              </Badge>
              <Badge variant={campaign.campaignType === "PRE_LAUNCH" ? "default" : "secondary"}>
                {campaign.campaignType === "PRE_LAUNCH" ? "Unpublished" : "Published"}
              </Badge>
              <Badge variant="outline" className={getTierBadge(campaign.tier)}>
                {campaign.tier || 'Starter'}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-white/40">Readers</p>
                <p className="font-medium text-white">{claims}</p>
              </div>
              <div>
                <p className="text-white/40">Reviews</p>
                <p className="font-medium text-white">{reviews}</p>
              </div>
              <div>
                <p className="text-white/40">Rate</p>
                <p className="font-medium text-white">
                  {claims > 0 ? Math.round((reviews / claims) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-white/50 hover:text-white hover:bg-white/5"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedCampaignId(campaign.id)
                  setCurrentView("campaign-detail")
                }}
              >
                View Details
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>

              {campaign.status === "PENDING_PAYMENT" && (
                <Button 
                  size="sm"
                  className="h-8 bg-amber-500 text-black hover:bg-amber-400 font-medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCampaignId(campaign.id)
                    setCurrentView("campaign-detail")
                  }}
                >
                  Pay Now
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
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20 pointer-events-none" />
      
      <div className="relative container px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">
            Welcome back, {user.name || "Author"}
          </h1>
          <p className="text-white/40">Your books are reaching real readers. No gatekeepers.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Campaigns" value={stats.totalCampaigns} />
          <StatCard icon={Users} label="Community Reach" value={stats.totalReach.toLocaleString()} sublabel="Total readers" />
          <StatCard icon={TrendingUp} label="Total Claims" value={stats.totalClaims} />
          <StatCard icon={Star} label="Reviews Earned" value={stats.totalReviews} sublabel="From engaged readers" />
        </div>

        {/* Quick Action */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5">
                <PlusCircle className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Share Another Book</h3>
                <p className="text-sm text-white/50">Free tier available for unpublished authors</p>
              </div>
            </div>
            <Button 
              className="bg-white text-black font-medium hover:bg-white/90 rounded-xl"
              onClick={() => setCurrentView("campaign-new")}
            >
              New Campaign
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Campaigns */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg"
            >
              All Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-white/40">Loading campaigns...</div>
            ) : campaigns.filter(c => c.status === "ACTIVE" || c.status === "PENDING_PAYMENT").length === 0 ? (
              <div className="space-y-6">
                <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 mb-4">
                    <BookOpen className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="font-medium text-white mb-2">Ready to reach your first 500 readers?</h3>
                  <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">
                    You haven&apos;t launched any campaigns yet. Start by sharing your book with our community.
                  </p>
                  <Button 
                    onClick={() => setCurrentView("campaign-new")}
                    className="bg-white text-black font-medium hover:bg-white/90 rounded-xl px-8"
                  >
                    Launch Your First Campaign
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl border border-white/5 bg-white/5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Star className="h-4 w-4 text-emerald-400" />
                    </div>
                    <h4 className="text-white font-medium mb-2 text-sm">1. Submit Book</h4>
                    <p className="text-xs text-white/40">Upload your manuscript or share your Amazon link.</p>
                  </div>
                  <div className="p-5 rounded-xl border border-white/5 bg-white/5">
                    <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                      <Users className="h-4 w-4 text-violet-400" />
                    </div>
                    <h4 className="text-white font-medium mb-2 text-sm">2. Choose Reach</h4>
                    <p className="text-xs text-white/40">Select how many guaranteed readers you want to reach.</p>
                  </div>
                  <div className="p-5 rounded-xl border border-white/5 bg-white/5">
                    <div className="h-8 w-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center mb-4">
                      <TrendingUp className="h-4 w-4 text-fuchsia-400" />
                    </div>
                    <h4 className="text-white font-medium mb-2 text-sm">3. Get Feedback</h4>
                    <p className="text-xs text-white/40">Watch as readers claim and review your work.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {campaigns.filter(c => c.status === "ACTIVE" || c.status === "PENDING_PAYMENT").map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-white/40">Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-4">
                  <BookOpen className="h-8 w-8 text-white/20" />
                </div>
                <h3 className="font-medium text-white mb-2">No Campaigns Yet</h3>
                <p className="text-sm text-white/40">Share your book with our community to get started</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
