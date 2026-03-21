"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by only rendering once mounted
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-card border border-border/50 text-foreground shadow-lg backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out hover:border-primary/50"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun 
          className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
            theme === "dark" 
              ? "scale-0 opacity-0 -rotate-90" 
              : "scale-100 opacity-100 rotate-0 text-amber-500"
          }`} 
        />
        <Moon 
          className={`absolute inset-0 w-full h-full text-blue-400 transition-all duration-500 ease-in-out ${
            theme === "dark" 
              ? "scale-100 opacity-100 rotate-0" 
              : "scale-0 opacity-0 rotate-90"
          }`} 
        />
      </div>
    </button>
  )
}
