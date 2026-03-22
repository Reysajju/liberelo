"use client"

import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Scale,
  Database,
  UserX,
  FileText,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

export function PrivacyPolicy() {
  const { setCurrentView } = useAppStore()

  const sections = [
    {
      icon: Shield,
      title: "Reader Identity Protection",
      content: [
        "Reader identities are protected under applicable national privacy laws including but not limited to GDPR, CCPA, and other data protection regulations.",
        "Authors receive only aggregate, anonymized data about reader engagement with their books.",
        "Individual reader information including names, email addresses, reading preferences, and engagement history are never shared with authors or third parties.",
        "Reader consent is required for all data collection, and readers maintain full control over their personal information."
      ]
    },
    {
      icon: Lock,
      title: "Data Collection & Use",
      content: [
        "We collect only the minimum necessary data to provide our services: account information, book preferences, and engagement metrics.",
        "All personal data is encrypted at rest and in transit using industry-standard encryption protocols.",
        "We do not sell, rent, or share personal data with third parties for marketing purposes.",
        "Analytics data is anonymized and aggregated before any external reporting."
      ]
    },
    {
      icon: Eye,
      title: "What Authors Can See",
      content: [
        "Total number of readers their book has been shared with.",
        "Aggregate claim and engagement statistics (not individual reader data).",
        "Anonymous engagement metrics (data points on reader interest, not personal identities).",
        "Campaign performance metrics in aggregate form."
      ]
    },
    {
      icon: UserX,
      title: "What Authors Cannot See",
      content: [
        "Individual reader names, emails, or contact information.",
        "Reader account details or profile information.",
        "Which specific readers claimed or downloaded their book.",
        "Reader reading preferences or history beyond genre matching."
      ]
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      content: [
        "We comply with the General Data Protection Regulation (GDPR) for European users.",
        "We comply with the California Consumer Privacy Act (CCPA) for California residents.",
        "We comply with all applicable national and international data protection laws.",
        "Regular privacy audits are conducted to ensure ongoing compliance.",
        "Users have the right to access, correct, or delete their personal data at any time."
      ]
    },
    {
      icon: Database,
      title: "Data Retention",
      content: [
        "Active account data is retained for the duration of your account plus 30 days.",
        "Campaign data is retained for 2 years after campaign completion for analytics purposes.",
        "After the retention period, all personal data is securely deleted.",
        "Anonymized aggregate data may be retained indefinitely for service improvement."
      ]
    },
    {
      icon: AlertTriangle,
      title: "Third-Party Services",
      content: [
        "We use Stripe for payment processing. Stripe's privacy policy applies to payment data.",
        "We may use analytics services that process only anonymized, aggregated data.",
        "All third-party vendors are vetted for privacy compliance and data security.",
        "We do not use third-party advertising networks that track user behavior."
      ]
    },
    {
      icon: FileText,
      title: "Your Rights",
      content: [
        "Right to access your personal data upon request.",
        "Right to correct inaccurate personal data.",
        "Right to delete your account and associated data.",
        "Right to export your data in a portable format.",
        "Right to object to processing of your personal data.",
        "Right to lodge a complaint with a supervisory authority."
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20" />
      
      <div className="relative">
        {/* Header */}
        <div className="container px-4 lg:px-8 py-8">
          <Button
            variant="ghost"
            className="text-white/50 hover:text-white mb-6"
            onClick={() => setCurrentView("landing")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 mb-6">
                <Shield className="h-8 w-8 text-violet-400" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
              <p className="text-white/50 max-w-2xl mx-auto">
                Your privacy matters. We are committed to protecting reader identities 
                and complying with all applicable data protection laws.
              </p>
              <p className="text-sm text-white/30 mt-4">Last updated: January 2025</p>
            </div>

            {/* Important Notice */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Shield className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Reader Identity Protection Notice</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    In compliance with national and international privacy laws, Liberelo maintains strict 
                    separation between author data and reader data. Authors receive only aggregate, 
                    anonymized engagement metrics. Individual reader identities, including names, contact 
                    information, and reading preferences, are never disclosed to authors or third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                      <section.icon className="h-6 w-6 text-violet-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white pt-2">{section.title}</h2>
                  </div>
                  
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Questions about your privacy?</h3>
              <p className="text-white/50 mb-6">
                If you have questions or concerns about our privacy practices, please contact our privacy team.
              </p>
              <Button 
                className="bg-white text-black font-medium hover:bg-white/90 rounded-xl"
                onClick={() => window.location.href = 'mailto:privacy@liberelo.com'}
              >
                Contact Privacy Team
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center text-sm text-white/30">
              <p>© {new Date().getFullYear()} Liberelo. All rights reserved.</p>
              <p className="mt-2">
                This policy is effective as of January 2025 and applies to all users of the Liberelo platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
