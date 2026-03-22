import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sparkles, LayoutDashboard, PlusCircle, Compass, Library, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface HeaderProps {
  user: {
    id: string
    name: string | null
    email: string
    userType: string
    image?: string | null
  } | null
}

export function Header({ user }: HeaderProps) {
  const { currentView, setCurrentView } = useAppStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isAuthor = user?.userType === "AUTHOR" || user?.userType === "BOTH"


  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between px-6 lg:px-8 max-w-7xl mx-auto">
        <Link 
          href="/"
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => setCurrentView("landing")}
        >
          <img src="/logo.png" alt="Liberelo Logo" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">Liberelo</span>
            <span className="text-[10px] text-primary/70 tracking-[0.2em] font-medium uppercase font-sans">Premium Author Discovery</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {!user && (
            <>
              <Link 
                href="/about"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors font-sans"
              >
                Our Story
              </Link>
              <Link 
                href="/how-it-works"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors font-sans"
              >
                How It Works
              </Link>
              <Link 
                href="/pricing"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors font-sans"
              >
                Pricing
              </Link>
              <Link 
                href="/faq"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors font-sans"
              >
                FAQ
              </Link>
              <Link 
                href="/contact"
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors font-sans"
              >
                Contact
              </Link>
            </>
          )}

          {user && (
            <>
              <Button
                variant="ghost"
                onClick={() => setCurrentView("dashboard")}
                className={`text-sm font-medium rounded-full px-4 transition-all font-sans ${
                  currentView === "dashboard" 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground/60 hover:text-foreground hover:bg-secondary/5"
                }`}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              
              {isAuthor && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("campaign-new")}
                  className={`text-sm font-medium rounded-full px-4 transition-all font-sans ${
                    currentView === "campaign-new" 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground/60 hover:text-foreground hover:bg-secondary/5"
                  }`}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Campaign
                </Button>
              )}
              

            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-serif font-medium">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border/50 shadow-md" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground font-sans">{user.name}</p>
                    <p className="text-xs text-foreground/60 font-sans">{user.email}</p>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary w-fit mt-1 uppercase tracking-wider font-sans">
                      {user.userType}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem onClick={handleLogout} className="text-foreground/80 hover:text-foreground hover:bg-secondary/5 cursor-pointer font-sans">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost"
                onClick={() => {
                  if (pathname === "/") setCurrentView("signin")
                  else router.push("/?view=signin")
                }}
                className="hidden sm:inline-flex text-foreground/80 hover:text-primary font-medium font-sans"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => {
                  if (pathname === "/") setCurrentView("signup")
                  else router.push("/?view=signup")
                }}
                className="bg-primary text-primary-foreground font-medium hover:bg-primary/90 rounded-xl px-6 font-sans shadow-sm"
              >
                Join Now
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-foreground/50 hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl absolute top-20 left-0 right-0 shadow-lg">
          <div className="flex flex-col gap-1 p-4">
            {!user && (
              <>
                <Link href="/about" className="flex items-center h-10 px-4 text-sm font-medium rounded-xl hover:bg-secondary/5" onClick={() => setMobileMenuOpen(false)}>Our Story</Link>
                <Link href="/how-it-works" className="flex items-center h-10 px-4 text-sm font-medium rounded-xl hover:bg-secondary/5" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                <Link href="/pricing" className="flex items-center h-10 px-4 text-sm font-medium rounded-xl hover:bg-secondary/5" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                <Link href="/faq" className="flex items-center h-10 px-4 text-sm font-medium rounded-xl hover:bg-secondary/5" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
                <Link href="/contact" className="flex items-center h-10 px-4 text-sm font-medium rounded-xl hover:bg-secondary/5" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                <div className="h-px bg-border my-2" />
                <Button variant="ghost" className="justify-start text-sm font-medium rounded-xl" onClick={() => { 
                  if (pathname === "/") setCurrentView("signin")
                  else router.push("/?view=signin")
                  setMobileMenuOpen(false) 
                }}>Sign In</Button>
                <Button className="justify-start text-sm font-medium rounded-xl bg-primary text-primary-foreground" onClick={() => { 
                  if (pathname === "/") setCurrentView("signup")
                  else router.push("/?view=signup")
                  setMobileMenuOpen(false) 
                }}>Join Now</Button>
              </>
            )}

            {user && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => { setCurrentView("dashboard"); setMobileMenuOpen(false) }}
                  className={`justify-start text-sm font-medium rounded-xl ${
                    currentView === "dashboard" ? "text-primary bg-primary/10" : "text-foreground/60"
                  }`}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                
                {isAuthor && (
                  <Button
                    variant="ghost"
                    onClick={() => { setCurrentView("campaign-new"); setMobileMenuOpen(false) }}
                    className={`justify-start text-sm font-medium rounded-xl ${
                      currentView === "campaign-new" ? "text-primary bg-primary/10" : "text-foreground/60"
                    }`}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Campaign
                  </Button>
                )}
                

              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
