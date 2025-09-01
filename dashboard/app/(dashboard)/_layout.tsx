export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/dashboard">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-bold">VedaRogya Dashboard</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
              <a
                className="text-sm font-medium transition-colors hover:text-primary"
                href="/dashboard"
              >
                Dashboard
              </a>
              <a
                className="text-sm font-medium transition-colors hover:text-primary"
                href="/patients"
              >
                Patients
              </a>
              <a
                className="text-sm font-medium transition-colors hover:text-primary"
                href="/appointments"
              >
                Appointments
              </a>
              <a
                className="text-sm font-medium transition-colors hover:text-primary"
                href="/profile"
              >
                Profile
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  )
}
