"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { setTheme, resolvedTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Avoid hydration mismatches before next-themes initializes
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" className="rounded-full">
        <Sun className="h-4 w-4 opacity-0" />
      </Button>
    )
  }

  const isDark = (resolvedTheme ?? theme) === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      className="rounded-full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
