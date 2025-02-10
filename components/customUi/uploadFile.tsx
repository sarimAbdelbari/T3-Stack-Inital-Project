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
import { postFile ,findFileById } from "@/lib/actions/fileActions";
import { useUser } from "@/context/UserProvider";

const UploadDropMe = () => {
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const [startUpload , setStartUpload] = useState(false);
  
  const user = useUser();
 

  // onBeforeUploadBegin={async (files) => {
  //   if (files && files.length > 0 && user?.id) {
  //     const result = await findFileById({ fileName: files[0]?.name, userId: user?.id });
  //     if (result) {
  //       infoToast("file Already Exists");
  //       return [];
  //     } else {
  //       return files;
  //     }
  //   }
  //   return files;
  // }}
  
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
              disabled={startUpload}
              onBeforeUploadBegin={async (files) => {
                setStartUpload(true);
    if (files && files.length > 0 && user?.id) {
      const result = await findFileById({ fileName: files[0]?.name, userId: user?.id });
      if (result) {
        infoToast("file Already Exists");
        return [];
      } else {
        return files;
      }
    }
    setStartUpload(false);
    return files;
  }}
              onUploadProgress={(progress) => {
                setIsUploading(progress - 10);
                setStartUpload(false);
                console.log(`Upload Progress: ${progress}%`);
              }}
              onClientUploadComplete={async (res) => {
                
                if (res && res.length > 0 && user?.id){
                 const result = await postFile({
                    name: res[0].name,
                    url: res[0].url,
                    key: res[0].key,
                    hash: res[0].fileHash,
                    userId: user.id,
                    uploadStatus:"SUCCESS",
                  });
   
                  console.log("res", res);

                  if (result.success) {
                    setIsUploading(100);
                    successToast("Upload Completed");
                  } else {
                    errorToast(`Error! ${result.error}`);
                    setIsUploading(0);
                  }
                }

                setStartUpload(false);
                setIsUploading(0);
              }}
              onUploadError={(error: Error) => {
                errorToast(`Error! ${error.message}`);
                setStartUpload(false);
                setIsUploading(0);
              }}
              onUploadAborted={() => {
                infoToast("Upload Aborted");
                setStartUpload(false);
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
