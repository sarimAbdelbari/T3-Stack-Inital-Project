import ChatWrapper from '@/components/customUi/chatWrapper';
import PdfRenderer from '@/components/customUi/pdfRenderer';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
// import { useParams } from 'next/navigation';
import React from 'react'


interface PageProps {
  params: {
    name: string
  }
}


const prisma = new PrismaClient();
const FilePage = async ({params } :PageProps) => {
  
  const { name } = params;

  const file = await prisma.file.findFirst({
    where: {
      name: name,
    }
  });

  if (!file) {
    redirect("/main/user/files");
  }
  return (
    <section className='flex flex-col gap-3 h-[calc(100vh-84px)]'>
   <div className='my-5'>
    <h3 className='text-2xl font-semibold font-serif '>Talk To your Document : <span className='text-primary text-xl '>{name}</span></h3>
   </div>
   <div className='h-full flex justify-between xl:flex-row flex-col '>

   {/* left side */}
      <div className='flex-1 xl:flex '>
        <div className='px-4 py-6 sm:px-6 lg:px-8 xl:flex-1 xl:pl-6'>
          <PdfRenderer url={file?.url}/>
        </div>
      </div>
      {/* right side */}
      <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
        <ChatWrapper fileId={file.id}/>
      </div>
   </div>
    </section>
  )
}

export default FilePage;