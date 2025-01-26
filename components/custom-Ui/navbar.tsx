import React from 'react'
import { ModeToggle } from '@/components/utils/modeToggle'

export default function NavBar() {
  return (
    <nav className='flex justify-between items-center'>
      
      <div className='flex-1'>
        logo
      </div>
      <div className=' hidden lg:flex flex-1 justify-center items-center'>
      
      <ul className='flex justify-between items-center w-full py-4'>
        <li>How to use</li>
        <li>content</li>
        <li>discount</li>
        <li><ModeToggle/></li>
      </ul>
      
      </div>
    </nav>
  )
}
