import React from 'react'
import { ModeToggle } from '@/components/utils/modeToggle'
import LogoutBtn from '@/components/auth/logoutBtn'

export default function NavBar() {
  return (
    <nav className='flex justify-between items-center py-4'>
      
      <div className='flex-1'>
        logo
      </div>
      <div className=' flex flex-1 justify-center items-center'>
      {/* hidden lg:flex */}
      <ul className='flex justify-between items-center w-full '>
        {/* <li>How to use</li>
        <li>content</li>
        <li>discount</li> */}
        <li><ModeToggle/></li>
        <li><LogoutBtn/></li>
      </ul>
      
      </div>
    </nav>
  )
}
