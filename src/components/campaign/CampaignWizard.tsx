"use client"

import { useState } from "react"
import { useAppStore } from "@/stores/app-store"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Upload, 
  FileText, 
  Link, 
  Mail,
  CheckCircle,
  Users,
  Shield,
  Sparkles,
  Zap,
  Crown,
  Star
} from "lucide-react"

interface CampaignWizardProps {
  user?: {
    id: string
    name: string | null
    email: string
    userType: string
  } | null
  onComplete: () => void
}

const GENRES = [
  "Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction", 
  "Fantasy", "Thriller", "Horror", "Biography", "Self-Help",
  "Young Adult", "Children's", "Historical Fiction", "Literary Fiction",
  "Contemporary", "Dystopian", "Adventure", "Paranormal", "Other"
]

// Unified tiers — single source of truth matching PricingPage
const TIERS = [
  { 
    id: "debut", 
    name: "Debut", 
    category: "ARC / Pre-Launch",
    price: 29, 
    reach: "500",
    readers: 500,
    description: "For new authors seeking their first wave of genuine reader feedback.",
    icon: Zap,
    features: [
      "Reach exactly 500 genre-matched readers",
      "Secure ARC distribution",
      "Amazon retail linking",
      "Basic engagement analytics",
    ],
    popular: false
  },
  { 
    id: "author", 
    name: "Author",
    category: "Published Authors",
    price: 79, 
    reach: "2,500",
    readers: 2500,
    description: "For established authors looking to reliably scale their launch.",
    icon: Sparkles,
    features: [
      "Reach exactly 2,500 genre-matched readers",
      "Priority feed placement",
      "Advanced sub-genre/trope targeting",
      "Real-time analytics dashboard",
    ],
    popular: true
  },
  { 
    id: "publisher", 
    name: "Publisher",
    category: "Published Authors",
    price: 199, 
    reach: "10,000",
    readers: 10000,
    description: "For high-volume imprints demanding maximum market penetration.",
    icon: Crown,
    features: [
      "Reach exactly 10,000 genre-matched readers",
      "Dedicated campaign manager",
      "Custom email blast to reader network",
      "White-glove listing setup",
    ],
    popular: false
  },
  { 
    id: "elite", 
    name: "Elite",
    category: "Published Authors",
    price: 349, 
    reach: "20,000",
    readers: 20000,
    description: "The ultimate reach package for guaranteed placement on bestseller radars.",
    icon: Star,
    features: [
      "Reach exactly 20,000 genre-matched readers",
      "Top-level site wide promotion",
      "Guaranteed cross-platform syndication pushing",
      "1-on-1 strategy call with team",
    ],
    popular: false
  },
]

export function CampaignWizard({ user, onComplete }: CampaignWizardProps) {
  const { setCurrentView, setGuestEmail } = useAppStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [campaignCreated, setCampaignCreated] = useState(false)
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    author: user?.name || "",
    genre: "",
    blurb: "",
    isbn: "",
    isPublished: false,
    campaignType: "PRE_LAUNCH" as "PRE_LAUNCH" | "POST_LAUNCH",
    manuscriptFile: null as File | null,
    manuscriptType: "",
    releaseDate: "",
    amazonUrl: "",
    appleBooksUrl: "",
    kindleUnlimited: false,
    tier: "author",
    campaignName: "",
    description: "",
    guestEmail: "",
  })

  const totalSteps = 4

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates })
  }

  const getTier = () => TIERS.find(t => t.id === formData.tier) || TIERS[1]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateFormData({ 
        manuscriptFile: file,
        manuscriptType: file.name.split('.').pop()?.toUpperCase() || ""
      })
    }
  }

  // Step 1: Create the book + campaign (PENDING_PAYMENT)
  // Step 2: PayPal handles payment
  // Step 3: On capture success, campaign goes ACTIVE
  const handleCreateCampaign = async (): Promise<string | null> => {
    setLoading(true)
    setPaymentError(null)
    
    try {
      // Create book
      const bookResponse = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          genre: formData.genre,
          blurb: formData.blurb,
          isbn: formData.isbn,
          status: formData.isPublished ? "PUBLISHED" : "PRE_LAUNCH",
          releaseDate: formData.releaseDate ? new Date(formData.releaseDate) : null,
          amazonUrl: formData.amazonUrl,
          appleBooksUrl: formData.appleBooksUrl,
          kindleUnlimited: formData.kindleUnlimited,
          authorId: user?.id,
          email: !user ? formData.guestEmail : undefined,
        }),
      })

      if (!bookResponse.ok) {
        const errorData = await bookResponse.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to create book")
      }
      const book = await bookResponse.json()

      // Upload manuscript if pre-launch
      if (!formData.isPublished && formData.manuscriptFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", formData.manuscriptFile)
        uploadFormData.append("bookId", book.id)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })
        if (!uploadRes.ok) console.error("Manuscript upload failed")
      }

      // Create campaign (PENDING_PAYMENT)
      const tier = getTier()
      const campaignResponse = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          authorId: user?.id,
          email: !user ? formData.guestEmail : undefined,
          campaignType: formData.isPublished ? "POST_LAUNCH" : "PRE_LAUNCH",
          targetReviewCount: tier.readers,
          name: formData.campaignName || `${formData.title} Campaign`,
          description: formData.description,
          totalAmount: tier.price,
          tier: formData.tier,
        }),
      })

      if (!campaignResponse.ok) {
        const errorData = await campaignResponse.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to create campaign")
      }
      
      const campaign = await campaignResponse.json()
      
      setCampaignId(campaign.id)
      return campaign.id
    } catch (error: any) {
      setPaymentError(error.message || "Failed to initiate campaign. Please try again.")
      return null
    } finally {
      setLoading(false)
    }
  }

  if (campaignCreated) {
    const tier = getTier()
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20 pointer-events-none" />
        
        <div className="relative w-full max-w-md text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-2xl opacity-40" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-3">Campaign Launched!</h2>
          <p className="text-white/50 mb-4">
            Payment confirmed. Your book will be shared with <span className="text-violet-400 font-semibold">{tier.reach} readers</span>.
          </p>
          
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-white/70">
              <Shield className="h-4 w-4 text-violet-400" />
              <span>Reader identities remain protected</span>
            </div>
          </div>
          
          <p className="text-sm text-white/40 mb-8">
            Remember: We guarantee reach, not reviews. Your book&apos;s quality determines engagement.
          </p>
          
          {user ? (
            <Button 
              className="w-full bg-white text-black font-medium hover:bg-white/90 h-12 rounded-xl"
              onClick={onComplete}
            >
              Go to Dashboard
            </Button>
          ) : (
            <div className="space-y-3">
              <Button 
                className="w-full bg-white text-black font-medium hover:bg-white/90 h-10 rounded-xl"
                onClick={() => setCurrentView("signup")}
              >
                Create Account to Manage Campaign
              </Button>
              <p className="text-xs text-white/30">
                We&apos;ve sent a confirmation email to <span className="text-violet-400">{formData.guestEmail}</span>.
                Please check your inbox.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20 pointer-events-none" />
      
      <div className="relative max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-white/50 hover:text-white"
          onClick={() => step === 1 ? setCurrentView("dashboard") : setStep(step - 1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step === 1 ? "Back to Dashboard" : "Previous Step"}
        </Button>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-white/50">Step {step} of {totalSteps}</span>
            <span className="text-white/50">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Publication Status */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-white mb-2">Is your book published?</h2>
              <p className="text-white/50">This determines how readers access your book.</p>
            </div>

            {!user && (
              <div className="space-y-2 mb-8">
                <Label htmlFor="guestEmail" className="text-white/70">Your Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="guestEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.guestEmail}
                    onChange={(e) => {
                      updateFormData({ guestEmail: e.target.value })
                      setGuestEmail(e.target.value)
                    }}
                    className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500 h-12 rounded-xl"
                    required
                  />
                </div>
                <p className="text-xs text-white/30">We&apos;ll use this to link your campaign to your account later.</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => updateFormData({ isPublished: false, campaignType: "PRE_LAUNCH" })}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                  !formData.isPublished
                    ? "bg-violet-500/10 border-violet-500/50"
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${!formData.isPublished ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                      <FileText className={`h-6 w-6 ${!formData.isPublished ? 'text-violet-400' : 'text-white/50'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Not yet published</h3>
                      <p className="text-sm text-white/40">ARC / Pre-launch manuscript</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/50">
                  Upload your manuscript. Readers will receive secure access before your launch date.
                </p>
              </button>

              <button
                onClick={() => updateFormData({ isPublished: true, campaignType: "POST_LAUNCH" })}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                  formData.isPublished
                    ? "bg-violet-500/10 border-violet-500/50"
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${formData.isPublished ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                      <Link className={`h-6 w-6 ${formData.isPublished ? 'text-violet-400' : 'text-white/50'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Already published</h3>
                      <p className="text-sm text-white/40">Available on Amazon or retailers</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/50">
                  Share your Amazon/retailer link. Readers will be directed to your book&apos;s page.
                </p>
              </button>
            </div>

            <Button 
              onClick={() => setStep(2)}
              className="w-full bg-white text-black font-medium hover:bg-white/90 h-12 rounded-xl mt-8"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Book Details */}
        {step === 2 && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">Book Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white/70">Book Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter your book title"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500 h-12 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-white/70">Author Name *</Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  value={formData.author}
                  onChange={(e) => updateFormData({ author: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500 h-12 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre" className="text-white/70">Genre *</Label>
                <Select value={formData.genre} onValueChange={(value) => updateFormData({ genre: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-violet-500 focus:ring-violet-500 h-12 rounded-xl">
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 rounded-xl">
                    {GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre} className="text-white hover:bg-white/10">{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blurb" className="text-white/70">Book Description</Label>
                <Textarea
                  id="blurb"
                  placeholder="Tell readers about your book..."
                  value={formData.blurb}
                  onChange={(e) => updateFormData({ blurb: e.target.value })}
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500 resize-none rounded-xl"
                />
                <p className="text-xs text-white/30">A compelling description increases reader engagement.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn" className="text-white/70">ISBN (optional)</Label>
                <Input
                  id="isbn"
                  placeholder="978-0-00-000000-0"
                  value={formData.isbn}
                  onChange={(e) => updateFormData({ isbn: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500 h-12 rounded-xl"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setStep(3)}
                className="w-full bg-white text-black font-medium hover:bg-white/90 h-12 rounded-xl"
                disabled={!formData.title || !formData.genre}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Upload/Links */}
        {step === 3 && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                {formData.isPublished ? "Book Links" : "Upload Manuscript"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {!formData.isPublished ? (
                <>
                  <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">
                    <p className="text-sm text-violet-300">
                      <strong>Secure Manuscript Upload</strong><br />
                      Your file will be watermarked and only accessible to readers who claim your book.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/70">Upload Manuscript *</Label>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-10 text-center hover:border-violet-500/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".epub,.pdf,.mobi"
                        onChange={handleFileChange}
                        className="hidden"
                        id="manuscript-upload"
                      />
                      <label htmlFor="manuscript-upload" className="cursor-pointer">
                        {formData.manuscriptFile ? (
                          <div className="flex items-center justify-center gap-4">
                            <div className="p-4 rounded-xl bg-violet-500/20">
                              <FileText className="h-8 w-8 text-violet-400" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-white">{formData.manuscriptFile.name}</p>
                              <p className="text-sm text-white/40">
                                {(formData.manuscriptFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-12 w-12 mx-auto text-white/30 mb-4" />
                            <p className="font-medium text-white mb-1">Click to upload</p>
                            <p className="text-sm text-white/40">EPUB, PDF, or MOBI up to 10MB</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="releaseDate" className="text-white/70">Expected Release Date (optional)</Label>
                    <Input
                      id="releaseDate"
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => updateFormData({ releaseDate: e.target.value })}
                      className="bg-white/5 border-white/10 text-white focus:border-violet-500 focus:ring-violet-500 h-12 rounded-xl"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">
                    <p className="text-sm text-violet-300">
                      <strong>Direct Traffic to Your Book</strong><br />
                      Readers will be directed to your book&apos;s page on Amazon or other retailers.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amazonUrl" className="text-white/70">Amazon URL *</Label>
                    <div className="relative">
                      <Link className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input
                        id="amazonUrl"
                        placeholder="https://amazon.com/dp/..."
                        value={formData.amazonUrl}
                        onChange={(e) => updateFormData({ amazonUrl: e.target.value })}
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appleBooksUrl" className="text-white/70">Apple Books URL (optional)</Label>
                    <div className="relative">
                      <Link className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input
                        id="appleBooksUrl"
                        placeholder="https://books.apple.com/..."
                        value={formData.appleBooksUrl}
                        onChange={(e) => updateFormData({ appleBooksUrl: e.target.value })}
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500 h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <input
                      type="checkbox"
                      id="kindleUnlimited"
                      checked={formData.kindleUnlimited}
                      onChange={(e) => updateFormData({ kindleUnlimited: e.target.checked })}
                      className="h-5 w-5 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500"
                    />
                    <div>
                      <Label htmlFor="kindleUnlimited" className="cursor-pointer text-white font-medium">Enrolled in Kindle Unlimited</Label>
                      {formData.kindleUnlimited && (
                        <p className="text-xs text-violet-400 mt-0.5">Great! Readers with KU can read for free.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setStep(4)}
                className="w-full bg-white text-black font-medium hover:bg-white/90 h-12 rounded-xl"
                disabled={
                  (!formData.isPublished && !formData.manuscriptFile) ||
                  (formData.isPublished && !formData.amazonUrl)
                }
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Tier Selection + PayPal Payment */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-white mb-2">Choose Your Reach</h2>
              <p className="text-white/50">Guaranteed number of readers who will see your book.</p>
            </div>

            <div className="space-y-4">
              {TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => updateFormData({ tier: tier.id })}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                    formData.tier === tier.id
                      ? "bg-violet-500/10 border-violet-500/50"
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-medium px-4 py-1 rounded-bl-xl">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${formData.tier === tier.id ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                        <tier.icon className={`h-6 w-6 ${formData.tier === tier.id ? 'text-violet-400' : 'text-white/40'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-xl">{tier.name}</h3>
                        <p className="text-sm text-white/40">{tier.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">${tier.price}</div>
                      <div className="text-xs text-white/30">one-time</div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 p-4 mb-5">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-violet-400" />
                      <span className="text-2xl font-bold text-white">{tier.reach}</span>
                      <span className="text-white/50">guaranteed readers reached</span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-white/60">
                        <CheckCircle className="h-4 w-4 text-violet-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {/* Important Note */}
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 p-5">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/70 font-medium">What we guarantee</p>
                  <p className="text-xs text-white/40 mt-1">
                    Your book will be shown to the guaranteed number of readers. Reviews depend on your book&apos;s 
                    quality and appeal — we never pay for reviews. Reader identities are protected under privacy laws.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Error */}
            {paymentError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-400">{paymentError}</p>
              </div>
            )}

            {/* Loading state while creating campaign */}
            {loading && (
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                <span className="text-white/60 text-sm">Setting up your campaign...</span>
              </div>
            )}

            {/* PayPal Smart Payment Buttons */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-center mb-4">
                <p className="text-white/70 text-sm font-medium mb-1">
                  Pay <span className="text-violet-400 font-bold text-lg">${getTier().price}</span> to launch your campaign
                </p>
                <p className="text-white/40 text-xs">Secure payment powered by PayPal</p>
              </div>
              
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                  currency: "USD",
                  intent: "capture",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "pay",
                    height: 50,
                  }}
                  disabled={loading}
                  createOrder={async () => {
                    setPaymentError(null)

                    // Create campaign first (PENDING_PAYMENT) if not already created
                    let currentCampaignId = campaignId
                    if (!currentCampaignId) {
                      currentCampaignId = await handleCreateCampaign()
                      if (!currentCampaignId) {
                        throw new Error("Failed to create campaign")
                      }
                    }

                    // Create PayPal order via our API
                    const tier = getTier()
                    const response = await fetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        campaignId: currentCampaignId,
                        amount: tier.price,
                        description: `Liberelo ${tier.name} Plan - ${formData.title}`,
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
                    try {
                      // Capture the payment via our API
                      const response = await fetch("/api/paypal/capture-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          orderID: data.orderID,
                          campaignId: campaignId,
                        }),
                      })

                      if (!response.ok) {
                        const error = await response.json()
                        throw new Error(error.error || "Failed to capture payment")
                      }

                      const captureData = await response.json()
                      
                      if (captureData.success) {
                        setCampaignCreated(true)
                      } else {
                        setPaymentError("Payment was not completed. Please try again.")
                      }
                    } catch (error) {
                      console.error("Payment capture error:", error)
                      setPaymentError("Payment processing failed. Please try again or contact support.")
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err)
                    setPaymentError("PayPal encountered an error. Please try again.")
                  }}
                  onCancel={() => {
                    setPaymentError("Payment was cancelled. You can try again when ready.")
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
