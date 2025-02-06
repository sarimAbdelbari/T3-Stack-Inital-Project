"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadDropzone, UploadButton } from "@/components/utils/uploadthing";
import { successToast, errorToast, infoToast } from "@/components/utils/toastNotification";
import { Progress } from "@/components/ui/progress";

const UploadDropMe = () => {
  const [isUploading, setIsUploading] = useState<number | null>(null);

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
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                setIsUploading(100);
                successToast("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                errorToast(`Error! ${error.message}`);
              }}
            onUploadAborted={() => {
                infoToast("Upload Aborted");
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
