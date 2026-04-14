import { Route, Switch } from "wouter"

import { GpaPage } from "@/pages/gpa/GpaPage"
import { NotFoundPage } from "@/pages/not-found/NotFoundPage"

function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Switch>
        <Route path="/" component={GpaPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
}

export default App
