import { MoonIcon, SunIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import styles from "@/components/layout/AppHeader.module.css"

type ThemeMode = "light" | "dark"

type AppHeaderProps = {
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
}

export function AppHeader({ theme, onThemeChange }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/logo.svg" alt="ofcourse logo" className={styles.logo} />
          <div className={styles.title}>ofcourse</div>
        </div>
        <nav className={styles.nav} aria-label="Primary">
          <Toggle
            variant="outline"
            size="sm"
            pressed={theme === "dark"}
            onPressedChange={(pressed) =>
              onThemeChange(pressed ? "dark" : "light")
            }
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <MoonIcon data-icon="inline-start" />
            ) : (
              <SunIcon data-icon="inline-start" />
            )}
            {theme === "dark" ? "Dark" : "Light"}
          </Toggle>
        </nav>
      </div>
      <Separator />
    </header>
  )
}
