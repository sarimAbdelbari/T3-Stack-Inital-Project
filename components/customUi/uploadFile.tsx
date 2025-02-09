"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/components/utils/uploadthing";
import { successToast, errorToast, infoToast } from "@/components/utils/toastNotification";
import { Progress } from "@/components/ui/progress";
import { postFile } from "@/lib/actions/fileActions";

const UploadDropMe = () => {
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const [file , setFile] = useState(null);


  
 

  return (
    <div className="border h-72 m-4 border-dashed border-gray-300 rounded-lg p-4 bg-muted flex flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center  w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer rounded-lg"
        >
          <div className="flex flex-col items-center justify-center ">
            {/* <Cloud/> */}
            <UploadDropzone
              endpoint="fileUploader"
              config={{ mode: "auto" }}
              onUploadProgress={(progress) => {
                setIsUploading(progress - 10);
                console.log(`Upload Progress: ${progress}%`);
              }}
              onClientUploadComplete={async (res) => {
                console.log("Files: ", res);
                if (res && res.length > 0){
                  await postFile(res)

                }
                
                setIsUploading(100);
                successToast("Upload Completed");
                setIsUploading(0);
              }}
              onUploadError={(error: Error) => {
                errorToast(`Error! ${error.message}`);
                setIsUploading(0);
              }}
              onUploadAborted={() => {
                infoToast("Upload Aborted");
                setIsUploading(0);
              }}
              
            />

            <Progress className="w-full" value={isUploading} />
          </div>
        </label>
      </div>
    </div>
  );
};

const UploadFile = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(e) => {
        if (!e) {
          setIsOpen(e);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload File</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Upload Your File</DialogTitle>
        <UploadDropMe />
      </DialogContent>
    </Dialog>
  );
};

export default UploadFile;
