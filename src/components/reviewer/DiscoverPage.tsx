"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  BookOpen, 
  Users, 
  Filter,
  ExternalLink,
  FileText,
  Loader2,
  Sparkles,
  Clock
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Campaign {
  id: string
  campaignType: string
  targetReviewCount: number
  createdAt: string
  tier?: string
  book: {
    id: string
    title: string
    author: string
    genre: string | null
    blurb: string | null
    coverImage: string | null
    amazonUrl: string | null
    status: string
  }
  _count?: {
    claims: number
  }
}

interface DiscoverPageProps {
  user: {
    id: string
    name: string | null
    email: string
    userType: string
    preferredGenres?: string | null
  }
}

const GENRES = [
  "All Genres", "Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction",
  "Fantasy", "Thriller", "Horror", "Biography", "Young Adult"
]

export function DiscoverPage({ user }: DiscoverPageProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All Genres")

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns/active")
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns || [])
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (campaignId: string) => {
    setClaimingId(campaignId)
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          reviewerId: user.id,
        }),
      })

      if (response.ok) {
        fetchCampaigns()
      }
    } catch (error) {
      console.error("Error claiming book:", error)
    } finally {
      setClaimingId(null)
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = 
      campaign.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.book.author.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesGenre = 
      selectedGenre === "All Genres" || 
      campaign.book.genre === selectedGenre
    
    return matchesSearch && matchesGenre
  })

  const preLaunchCampaigns = filteredCampaigns.filter(c => c.campaignType === "PRE_LAUNCH")
  const postLaunchCampaigns = filteredCampaigns.filter(c => c.campaignType === "POST_LAUNCH")

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const spotsRemaining = campaign.targetReviewCount - (campaign._count?.claims || 0)
    const isFull = spotsRemaining <= 0
    const isNew = new Date(campaign.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000

    return (
      <div className="group rounded-xl border border-white/10 bg-white/5 p-5 hover:border-violet-500/50 transition-all duration-300">
        <div className="flex gap-5">
          {/* Book Cover */}
          <div className="h-36 w-28 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden">
            {campaign.book.coverImage ? (
              <img 
                src={campaign.book.coverImage} 
                alt={campaign.book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <BookOpen className="h-10 w-10 text-white/20" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white text-lg leading-tight">{campaign.book.title}</h3>
                  {isNew && (
                    <Badge className="bg-violet-500 text-white border-0 text-xs">New</Badge>
                  )}
                </div>
                <p className="text-sm text-white/40">by {campaign.book.author}</p>
              </div>
              <Badge className={
                campaign.campaignType === "PRE_LAUNCH" 
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-violet-500/10 text-violet-400 border-violet-500/20"
              }>
                {campaign.campaignType === "PRE_LAUNCH" ? "ARC" : "Published"}
              </Badge>
            </div>

            {campaign.book.genre && (
              <Badge variant="outline" className="bg-white/5 text-white/50 border-white/10 mb-3">
                {campaign.book.genre}
              </Badge>
            )}

            {campaign.book.blurb && (
              <p className="text-sm text-white/40 line-clamp-2 mb-4">
                {campaign.book.blurb}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-white/40 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{spotsRemaining} spots left</span>
              </div>
              {campaign.campaignType === "PRE_LAUNCH" && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Free eBook</span>
                </div>
              )}
              {campaign.tier && (
                <Badge variant="outline" className="bg-white/5 text-white/30 border-white/10 text-xs capitalize">
                  {campaign.tier}
                </Badge>
              )}
            </div>

            {/* Action */}
            {isFull ? (
              <Button disabled className="w-full h-10 rounded-lg bg-white/5 text-white/40">
                Campaign Full
              </Button>
            ) : (
              <Button 
                className="w-full h-10 rounded-lg bg-white text-black font-medium hover:bg-white/90"
                onClick={() => handleClaim(campaign.id)}
                disabled={claimingId === campaign.id}
              >
                {claimingId === campaign.id && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {campaign.campaignType === "PRE_LAUNCH" ? "Claim Free Copy" : "Claim Review Spot"}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20 pointer-events-none" />
      
      <div className="relative container px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Discover Books</h1>
          </div>
          <p className="text-white/40">Find your next great read. Free books from independent authors.</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-2xl font-semibold text-white">{campaigns.length}</p>
            <p className="text-xs text-white/40">Books Available</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-2xl font-semibold text-violet-400">{preLaunchCampaigns.length}</p>
            <p className="text-xs text-white/40">ARCs (Free)</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-2xl font-semibold text-white">{postLaunchCampaigns.length}</p>
            <p className="text-xs text-white/40">Published</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
            />
          </div>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full md:w-48 h-11 bg-white/5 border-white/10 text-white focus:border-violet-500 focus:ring-violet-500 rounded-xl">
              <Filter className="mr-2 h-4 w-4 text-white/30" />
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              {GENRES.map((genre) => (
                <SelectItem key={genre} value={genre} className="text-white hover:bg-white/10">{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg"
            >
              All Books ({filteredCampaigns.length})
            </TabsTrigger>
            <TabsTrigger 
              value="arc"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg"
            >
              Free ARCs ({preLaunchCampaigns.length})
            </TabsTrigger>
            <TabsTrigger 
              value="published"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg"
            >
              Published ({postLaunchCampaigns.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-white/30" />
              <p className="text-white/40 mt-4">Loading books...</p>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-4">
                {filteredCampaigns.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
                    <BookOpen className="h-12 w-12 mx-auto text-white/20 mb-4" />
                    <h3 className="font-medium text-white mb-2">No Books Found</h3>
                    <p className="text-sm text-white/40">Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredCampaigns.map((campaign) => (
                      <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="arc" className="space-y-4">
                {preLaunchCampaigns.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
                    <FileText className="h-12 w-12 mx-auto text-white/20 mb-4" />
                    <h3 className="font-medium text-white mb-2">No ARCs Available</h3>
                    <p className="text-sm text-white/40">Check back soon for new advance review copies.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {preLaunchCampaigns.map((campaign) => (
                      <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="published" className="space-y-4">
                {postLaunchCampaigns.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
                    <BookOpen className="h-12 w-12 mx-auto text-white/20 mb-4" />
                    <h3 className="font-medium text-white mb-2">No Published Books Available</h3>
                    <p className="text-sm text-white/40">Check back soon for new opportunities.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {postLaunchCampaigns.map((campaign) => (
                      <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* How It Works */}
        <div className="mt-12 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5">
          <h3 className="font-medium text-white mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-white/5 h-fit">
                <BookOpen className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-white">Claim Free Books</p>
                <p className="text-white/40">Browse and claim ARCs from independent authors</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-white/5 h-fit">
                <Clock className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-white">Read Within 14 Days</p>
                <p className="text-white/40">Download and enjoy your free book</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-white/5 h-fit">
                <Sparkles className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-white">Share Your Review</p>
                <p className="text-white/40">Help authors by posting an honest review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
