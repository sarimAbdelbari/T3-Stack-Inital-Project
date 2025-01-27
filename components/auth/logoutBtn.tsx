"use client";

import { LogOut } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useActionState ,useEffect } from 'react'
import { logoutProvider } from "@/lib/providers/auth";
import { errorToast, successToast } from "@/components/utils/toastNotification";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
    
  const router = useRouter();   
  const [state, action, pending] = useActionState(logoutProvider, undefined)

  // Handle side effects when `state` changes
    useEffect(() => {
      if (state?.success) {
        successToast(state?.message ?? "Logout  successful");
        router.push("/dashboard");
      } else if (state?.error) {
        errorToast(state?.error ?? "Something went wrong");
      }
  
    }, [state, router]);

  return (
    <Button  disabled={pending} onClick={action}> 
        <LogOut />
       Log out
    </Button>
  )
}
