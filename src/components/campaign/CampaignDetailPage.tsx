import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/stores/app-store"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { 
  ArrowLeft,
  BookOpen, 
  Users, 
  Star, 
  Clock,
  ExternalLink,
  Mail,
  Shield,
  CheckCircle,
  Loader2
} from "lucide-react"

interface Claim {
  id: string
  status: string
  claimedAt: string
  reviewUrl: string | null
  reviewer: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

interface Campaign {
  id: string
  name: string | null
  description: string | null
  campaignType: string
  targetReviewCount: number
  totalAmount: number
  status: string
  createdAt: string
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
    status: string
  }
  claims: Claim[]
  _count?: {
    claims: number
  }
}

interface CampaignDetailPageProps {
  campaignId: string
  user: {
    id: string
    name: string | null
    email: string
    userType: string
  }
}

export function CampaignDetailPage({ campaignId, user }: CampaignDetailPageProps) {
  const { setCurrentView } = useAppStore()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)

  useEffect(() => {
    fetchCampaign()
  }, [campaignId])

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`)
      if (response.ok) {
        const data = await response.json()
        setCampaign(data.campaign)
      }
    } catch (error) {
      console.error("Error fetching campaign:", error)
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

  const getCampaignStatusColor = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      PENDING_PAYMENT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      COMPLETED: "bg-white/5 text-white/50 border-white/10",
      PAUSED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    }
    return styles[status] || "bg-white/5 text-white/50 border-white/10"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/40">Loading campaign...</div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white/40 mb-4">Campaign not found</p>
        <Button onClick={() => setCurrentView("dashboard")} className="bg-white text-black">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const completedReviews = campaign.claims.filter(c => c.status === "REVIEWED").length
  const pendingReviews = campaign.claims.filter(c => c.status !== "REVIEWED" && c.status !== "GHOSTED").length
  const progress = (completedReviews / campaign.targetReviewCount) * 100

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
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20 pointer-events-none" />
      
      <div className="relative container px-4 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-white/50 hover:text-white"
          onClick={() => setCurrentView("dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Book Cover */}
          <div className="h-56 w-40 bg-white/5 rounded-xl flex-shrink-0 overflow-hidden shadow-lg">
            {campaign.book.coverImage ? (
              <img 
                src={campaign.book.coverImage} 
                alt={campaign.book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <BookOpen className="h-14 w-14 text-white/20" />
              </div>
            )}
          </div>

          {/* Campaign Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h1 className="text-2xl lg:text-3xl font-semibold text-white">{campaign.book.title}</h1>
              <Badge className={getCampaignStatusColor(campaign.status)}>
                {campaign.status.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="bg-white/5 text-white/50 border-white/10">
                {campaign.campaignType === "PRE_LAUNCH" ? "Pre-Launch (ARC)" : "Post-Launch (Boost)"}
              </Badge>
            </div>
            
            <p className="text-white/50 mb-4">by {campaign.book.author}</p>
            
            {campaign.book.genre && (
              <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20 mb-6">
                {campaign.book.genre}
              </Badge>
            )}

            {/* If Pending Payment, show Payment Required UI */}
            {campaign.status === "PENDING_PAYMENT" ? (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-amber-500/20">
                    <Shield className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Payment Required</h3>
                    <p className="text-sm text-white/50">Your campaign is drafted but not yet active. Complete the payment to start reaching readers.</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-2xl font-bold text-white">${campaign.totalAmount}</p>
                    <p className="text-sm text-white/40">One-time launching fee</p>
                  </div>

                  <div className="w-full md:w-64">
                    <PayPalScriptProvider
                      options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                        currency: "USD",
                        intent: "capture",
                      }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "horizontal",
                          color: "gold",
                          shape: "rect",
                          label: "pay",
                          height: 45,
                        }}
                        createOrder={async () => {
                          setPaymentError(null)
                          const response = await fetch("/api/paypal/create-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              campaignId: campaign.id,
                              amount: campaign.totalAmount,
                              description: `Liberelo Campaign Resume - ${campaign.book.title}`,
                            }),
                          })

                          if (!response.ok) {
                            const error = await response.json()
                            throw new Error(error.error || "Failed to create order")
                          }

                          const data = await response.json()
                          return data.orderID
                        }}
                        onApprove={async (data) => {
                          setCapturing(true)
                          try {
                            const response = await fetch("/api/paypal/capture-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                orderID: data.orderID,
                                campaignId: campaign.id,
                              }),
                            })

                            if (!response.ok) {
                              const error = await response.json()
                              throw new Error(error.error || "Failed to capture payment")
                            }

                            const captureData = await response.json()
                            if (captureData.success) {
                              fetchCampaign() // Refresh to show ACTIVE status
                            } else {
                              setPaymentError("Payment was not completed.")
                            }
                          } catch (error) {
                            console.error("Capture error:", error)
                            setPaymentError("Payment failed to capture.")
                          } finally {
                            setCapturing(false)
                          }
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>

                {paymentError && (
                  <p className="mt-4 text-sm text-rose-400 font-medium">{paymentError}</p>
                )}
                
                {capturing && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Completing transaction...
                  </div>
                )}
              </div>
            ) : (
              /* Progress (Only for Active/Completed) */
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">Review Progress</span>
                  <span className="text-white font-medium">{completedReviews} / {campaign.targetReviewCount}</span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {campaign.book.amazonUrl && (
                <Button 
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  onClick={() => window.open(campaign.book.amazonUrl!, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Amazon
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats (Hide if Pending Payment as they are zeroed) */}
        {campaign.status !== "PENDING_PAYMENT" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Claims" value={campaign.claims.length} />
            <StatCard icon={Star} label="Reviews Complete" value={completedReviews} accent />
            <StatCard icon={Clock} label="Pending Reviews" value={pendingReviews} />
            <StatCard 
              icon={BookOpen} 
              label="Completion Rate" 
              value={`${campaign.claims.length > 0 ? Math.round((completedReviews / campaign.claims.length) * 100) : 0}%`} 
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue={campaign.status === "PENDING_PAYMENT" ? "details" : "reviewers"} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger 
              value="reviewers"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg"
              disabled={campaign.status === "PENDING_PAYMENT"}
            >
              Reviewers ({campaign.claims.length})
            </TabsTrigger>
            <TabsTrigger 
              value="details"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 rounded-lg"
            >
              Campaign Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviewers">
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="font-medium text-white">Claimed Reviewers</h3>
                <p className="text-sm text-white/40 mt-1">Track the status of each reviewer who claimed your book.</p>
              </div>
              
              {campaign.claims.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  No reviewers have claimed this book yet.
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {campaign.claims.map((claim) => (
                    <div 
                      key={claim.id}
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-medium">
                          {claim.reviewer.name?.charAt(0).toUpperCase() || "R"}
                        </div>
                        <div>
                          <p className="font-medium text-white">{claim.reviewer.name || "Anonymous"}</p>
                          <p className="text-sm text-white/40">
                            Claimed {new Date(claim.claimedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getStatusColor(claim.status)}>
                          {claim.status.toLowerCase()}
                        </Badge>
                        {claim.status === "REVIEWED" && claim.reviewUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-white/50 hover:text-white"
                            onClick={() => window.open(claim.reviewUrl!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        {claim.status !== "REVIEWED" && claim.status !== "GHOSTED" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-white/50 hover:text-white"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Book Details */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white mb-4">Book Details</h3>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm text-white/40 mb-1">Title</p>
                  <p className="text-white font-medium">{campaign.book.title}</p>
                </div>
                <div>
                  <p className="text-sm text-white/40 mb-1">Author</p>
                  <p className="text-white font-medium">{campaign.book.author}</p>
                </div>
                {campaign.book.genre && (
                  <div>
                    <p className="text-sm text-white/40 mb-1">Genre</p>
                    <p className="text-white font-medium">{campaign.book.genre}</p>
                  </div>
                )}
                {campaign.book.blurb && (
                  <div>
                    <p className="text-sm text-white/40 mb-1">Blurb</p>
                    <p className="text-white/70 text-sm leading-relaxed">{campaign.book.blurb}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Settings */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white mb-4">Campaign Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/40 mb-1">Campaign Type</p>
                  <p className="text-white font-medium">
                    {campaign.campaignType === "PRE_LAUNCH" ? "Pre-Launch (ARC)" : "Post-Launch (Boost)"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/40 mb-1">Target Reviews</p>
                  <p className="text-white font-medium">{campaign.targetReviewCount}</p>
                </div>
                <div>
                  <p className="text-sm text-white/40 mb-1">Total Spent</p>
                  <p className="text-white font-medium">${campaign.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-white/40 mb-1">Created</p>
                  <p className="text-white font-medium">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {campaign.description && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-white/40 mb-1">Notes for Reviewers</p>
                  <p className="text-white/70 text-sm">{campaign.description}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
