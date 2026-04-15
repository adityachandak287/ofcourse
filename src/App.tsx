import * as React from "react"
import { Route, Switch } from "wouter"

import { AppHeader } from "@/components/layout/AppHeader"
import { GpaPage } from "@/pages/gpa/GpaPage"
import { NotFoundPage } from "@/pages/not-found/NotFoundPage"

const THEME_STORAGE_KEY = "ofcourse-theme"

type ThemeMode = "light" | "dark"

function getPreferredTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === "light" || stored === "dark") return stored

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}

function App() {
  const [theme, setTheme] = React.useState<ThemeMode>("light")

  React.useEffect(() => {
    setTheme(getPreferredTheme())
  }, [])

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <AppHeader theme={theme} onThemeChange={setTheme} />
      <Switch>
        <Route path="/" component={GpaPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
}

export default App
