import { Sparkles, Twitter, Github, Mail, Shield, FileText, BookOpen } from "lucide-react"
import { useAppStore } from "@/stores/app-store"
import Link from "next/link"

export function Footer() {
  const { setCurrentView } = useAppStore()

  return (
    <footer className="mt-auto border-t border-border bg-card/80 backdrop-blur-xl">
      <div className="container px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link 
              href="/"
              className="flex items-center gap-4 mb-6 cursor-pointer group" 
              onClick={() => setCurrentView("landing")}
            >
              <img src="/logo.png" alt="Liberelo Logo" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" />
              <span className="font-serif text-3xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">Liberelo</span>
            </Link>
            <p className="text-base text-foreground/60 max-w-sm mb-8 leading-relaxed font-sans">
              Liberating authors from the nonsense loop. We connect your books with real readers, guaranteed. An exclusive community for literary discovery.
            </p>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full border border-border/50 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary cursor-pointer transition-all">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="h-10 w-10 rounded-full border border-border/50 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary cursor-pointer transition-all">
                <Github className="h-4 w-4" />
              </div>
              <Link 
                href="/contact"
                className="h-10 w-10 rounded-full border border-border/50 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary cursor-pointer transition-all"
                onClick={() => setCurrentView("contact")}
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-6">
            <h3 className="font-serif font-medium text-foreground text-lg">Platform</h3>
            <ul className="space-y-4 text-sm text-foreground/60 font-sans">
              <li className="hover:text-primary transition-colors">
                <Link href="/about" onClick={() => setCurrentView("about")}>Our Story</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="/how-it-works" onClick={() => setCurrentView("how-it-works")}>How It Works</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="/pricing" onClick={() => setCurrentView("pricing")}>Pricing</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="font-serif font-medium text-foreground text-lg">Support</h3>
            <ul className="space-y-4 text-sm text-foreground/60 font-sans">
              <li className="hover:text-primary transition-colors">
                <Link href="/faq" onClick={() => setCurrentView("faq")}>FAQ</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="/contact" onClick={() => setCurrentView("contact")}>Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="font-serif font-medium text-foreground text-lg">Legal</h3>
            <ul className="space-y-4 text-sm text-foreground/60 font-sans">
              <li 
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <Link href="/privacy" onClick={() => setCurrentView("privacy")} className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Privacy Policy
                </Link>
              </li>
              <li className="hover:text-primary transition-colors flex items-center gap-2">
                <Link href="/terms" onClick={() => setCurrentView("terms")} className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Terms of Service
                </Link>
              </li>
              <li className="hover:text-primary transition-colors flex items-center gap-2">
                <Link href="/agreement" onClick={() => setCurrentView("agreement")} className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5" />
                  Author Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <p className="text-sm text-foreground/40 font-sans">
            © {new Date().getFullYear()} Liberelo. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-sm text-foreground/40 font-sans">
            <span className="flex items-center gap-2">
              <Shield className="h-3 w-3 text-secondary" />
              Data Protected
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
