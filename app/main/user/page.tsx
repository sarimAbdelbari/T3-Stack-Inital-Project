import React from 'react'
import UploadFile from '@/components/custom-Ui/uploadFile'

function Client() {
  return (
      <main className='my-10'>
        <div className='flex justify-between items-center '>
            <h3 className='text-2xl font-bold'>Mes documents</h3>
            
        <UploadFile />
        </div>
      </main>
        
  )
}

export default Client
