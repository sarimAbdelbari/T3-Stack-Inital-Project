import { auth } from "@/lib/auth";
// import Image from "next/image";
import { SkeletonCard } from "@/components/ui/skeletonCard";
import { redirect } from "next/navigation";
import { getFilesByUserId } from "@/lib/actions/fileActions";
import ToastWrapper from "@/components/customUi/toastWrapper";
import { Ghost} from "lucide-react";

import FileBox from "@/components/customUi/fileBox";


const BoxFiles = async () => {
    
  const session = await auth()
   
  if (!session?.user) {
    redirect("/");
  }
 

   let files;
   let errorMessage: string | undefined;
   let loading = false;


   try {
    loading = true;

    if (session.user.email) {
      files = await getFilesByUserId(session.user.email);
    } 

    loading = false;
   } catch (error) {
    console.error(error);
    errorMessage = "Failed to fetch files";
    loading = false;
   }
 

  return (
    <div  > 
      <ToastWrapper errorMessage={errorMessage} />
      {loading ? (<div className="mt-16 flex flex-wrap items-center gap-7"><SkeletonCard  /> <SkeletonCard  /> <SkeletonCard  /> <SkeletonCard  /></div>) : (
    
        <div>
        {files && files.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3 ">

        {files.map((file) => (
          <FileBox file={file} key={file.id} />
        ))}
          </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="text-muted-foreground h-8 w-8" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload some Pdfs</p>
        </div>
      )}
      </div>
      )}
   
    </div>
  )
}

export default BoxFiles;