import UploadFile from '@/components/custom-Ui/uploadFile'
import BoxFiles from '@/components/user/files/boxOfFiles'
import React from 'react'

export default function User() {
  return (
    <main className='my-10'>
        <div className='flex justify-between items-center '>
          <h3 className='text-2xl font-bold'>Mes documents</h3>
          <UploadFile />
        </div>
        {/* display all user files */}
         <>
         <BoxFiles/>
         </>
      </main>
        
  )
}

