import { LoginForm } from "@/components/auth/loginForm";
import { Suspense } from "react";
import Loading from "../loading"


export default async function LoginPage() {
 
 

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<Loading />}>
         <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
