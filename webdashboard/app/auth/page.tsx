import { Leaf } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function AuthPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Leaf className="size-4" />
            </div>
            Vedarogya
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Leaf className="mx-auto h-32 w-32 opacity-20" />
            <h2 className="mt-4 text-2xl font-semibold">Welcome to Vedarogya</h2>
            <p className="mt-2 text-sm">Your Ayurvedic Health Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  )
}
