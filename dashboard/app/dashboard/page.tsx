"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamically import dashboard components to prevent hydration issues
const DashboardContent = dynamic(() => import("@/components/dashboard-content"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">VedaRogya Dashboard</h1>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  )
})

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">VedaRogya Dashboard</h1>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
