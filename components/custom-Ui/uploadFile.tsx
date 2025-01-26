"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

const UploadFile = () => {
  
    const [isOpen , setIsOpen] = useState<boolean>(false);


  return (
    <Dialog open={isOpen} onOpenChange={(e)=>{
        if(!e){
            setIsOpen(e);
        }
    }}>
        <DialogTrigger onClick={()=>setIsOpen(true)} asChild>
        <Button >Upload File</Button>
        </DialogTrigger>

        <DialogContent>
            Drag you file in this box
        </DialogContent>
    </Dialog>
  )
}

export default UploadFile