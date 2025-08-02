// components/ThemeToggle.tsx
"use client"

import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useThemeToggle } from "@/hooks/useTheme"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeToggle()
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  )
}