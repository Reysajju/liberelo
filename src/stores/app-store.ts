import { create } from "zustand"

export type ViewMode = 
  | "landing" 
  | "auth" 
  | "signin"
  | "signup"
  | "forgot-password"
  | "about"
  | "how-it-works"
  | "faq"
  | "contact"
  | "terms"
  | "agreement"
  | "pricing"
  | "dashboard" 
  | "campaign-new" 
  | "campaign-detail" 
  | "discover" 
  | "library" 
  | "privacy"

interface AppState {
  currentView: ViewMode
  selectedCampaignId: string | null
  setUserType: "AUTHOR" | "REVIEWER" | null
  
  // Navigation
  setCurrentView: (view: ViewMode) => void
  setSelectedCampaignId: (id: string | null) => void
  setSetUserType: (type: "AUTHOR" | "REVIEWER" | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: "landing",
  selectedCampaignId: null,
  setUserType: null,
  
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),
  setSetUserType: (type) => set({ setUserType: type }),
}))
