"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import Dropzone from 'react-dropzone'
import { Cloud, File } from 'lucide-react'
import { UploadButton } from '@/components/utils/uploadthing'
import { successToast , errorToast} from '@/components/utils/toastNotification'
import { Progress } from '@/components/ui/progress'

const UploadDropZone = () => {
 
    const [isUploading , setIsUploading] =useState(null);

    return (
        <Dropzone multiple={false} onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
         {({getRootProps, getInputProps , acceptedFiles}) => (
             <div {...getRootProps()} className='border h-64 m-4 border-dashed border-gray-300 rounded-lg p-4 bg-muted flex flex-col items-center justify-center gap-4'>
                <div className='flex items-center justify-center  w-full'>
                    <label htmlFor='dropzone-file' className='flex flex-col items-center justify-center w-full h-full cursor-pointer rounded-lg'>
                        <div className='flex flex-col items-center justify-center '>
                          <Cloud/>
                          <UploadButton 
                          endpoint="fileUploader"
                          onUploadProgress={(progress) => {
                            setIsUploading(progress)
                            console.log(`Upload Progress: ${progress}%`)
                          }}
                          onClientUploadComplete={(res) => {
                            // // Do something with the response
                            console.log("Files: ", res);
                            successToast("Upload Completed");
                          }}
                          onUploadError={(error: Error) => {
                            // // Do something with the error.
                            errorToast(`Error! ${error.message}`)
                          }} 
                          />
                          <p className='my-2 text-sm text-zinc-700'>
                            <span className='font-semibold text-foreground'>
                            Drag or Click To Upload The File
                            </span>{' '}
                           </p>
                            <p className='text-xs text-muted-foreground'>Only PDF files are allowed Size (4 Mb)</p>
                            <Progress value={isUploading}/>
                        </div>
                        
                    </label>
                </div>

                {acceptedFiles && acceptedFiles[0] ?(
                    <div className='max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-1 outline-secondary '>
                        <div className='h-full grid place-items-center border  px-3 py-2 '>
                            <File className='h-4 w-4 text-primary'/>
                        </div>
                        <div className=' px-3 py-2 h-full truncate border  text-sm font-semibold '>{acceptedFiles[0].name}</div>
                    </div>
                ) : null}
             </div> 
         )}
        </Dropzone>
    )
}



const UploadFile = () => {
  
    const [isOpen , setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(e)=>{
        if(!e){
            setIsOpen(e);
        }
    }}>
        <DialogTrigger onClick={()=>setIsOpen(true)} asChild>
        <Button>Upload File</Button>
        </DialogTrigger>

        <DialogContent>
            <DialogTitle>Upload Your File</DialogTitle>
            <UploadDropZone />
        </DialogContent>
    </Dialog>
  )
}

export default UploadFile