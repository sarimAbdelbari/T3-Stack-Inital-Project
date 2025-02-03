import UploadFile from '@/components/customUi/uploadFile'
import BoxFiles from '@/components/customUi/user/files/boxOfFiles'
import React from 'react'

export default function User() {
  return (
    <main className='my-10'>
        <div className='flex justify-between items-center '>
          <h3 className='text-2xl font-bold'>Mes Documents :</h3>
          <UploadFile />
        </div>
        {/* display all user files */}
         <div className='w-full min-h-96 h-full my-11'>
         <BoxFiles/>
         </div>
      </main>
        
  )
}
