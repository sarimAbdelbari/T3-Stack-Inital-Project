"use client";

import { Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ToastWrapper from '@/components/custom-Ui/toastWrapper';
import { deletefilebyId } from '@/lib/actions/fileActions';
import { useState } from "react";

interface File {
  id: string;
  name: string;
  createdAt: Date;
}

const FileBox = ({file}: {file: File}) => {


  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const result = await deletefilebyId(id);

      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete file");
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <>
    <ToastWrapper successMessage={successMessage} errorMessage={errorMessage}/>
    <li key={file.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg">
    <Link href={`/main/user/files/${file.id}`} className='flex flex-col gap-2'>
    <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
            <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary' />
            <div className='flex-1 truncate'>
              <div className='flex items-center space-x-3'>
                <h3 className='truncate text-lg font-medium text-zinc-900'>
                  {file.name}
                </h3>
              </div>
            </div>
          </div>
    </Link>
    <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500'>
          <div className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            {format(
              new Date(file.createdAt),
              'MMM yyyy'
            )}
          </div>

          <div className='flex items-center gap-2'>
            <MessageSquare className='h-4 w-4' />
            mocked
          </div>

          <Button
            onClick={() =>
              handleDelete(file.id)
            }
            size='sm'
            className='w-full'
            variant='destructive'>
            {loading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Trash className='h-4 w-4' />
            )}
          </Button>
        </div>
  </li></>
  )
}

export default FileBox