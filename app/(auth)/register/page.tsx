import { RegisterForm } from "@/components/auth/registerForm"
import { Suspense } from "react"
import Loading from "@/app/(auth)/loading"

export default function registerPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
      <Suspense fallback={<Loading />}>
        <RegisterForm />
      </Suspense>
      </div>
    </div>
  )
}
