import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";

const prisma = new PrismaClient()
const BoxFiles = async () => {
    
    const session = await auth()

    const files = await prisma.file.findMany({
        where: {
          userId: session?.user?.id,
        },
        select: {
          name: true,
          url: true,
          uploadStatus: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },);

 
    console.log("files" ,files)

  return (
    <>
    {files && files.length > 0 && (
      <div>
        {files.map((file) => (
          <div key={file.name}>
            <Image href={file.url} alt={file.name} />
            <p>{file.name}</p>
            <p>{file.uploadStatus}</p>
          </div>
        ))}
      </div>
    )}
    </>
  )
}

export default BoxFiles;