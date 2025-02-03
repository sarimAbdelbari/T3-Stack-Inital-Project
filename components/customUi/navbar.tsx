import React from 'react'
import { ModeToggle } from '@/components/utils/modeToggle'
import LogoutBtn from '@/components/auth/logoutBtn'
import Image from 'next/image'

export default function NavBar() {
  return (
    <nav className='flex justify-between items-center py-3'>
      
      <div className='flex-1'>
        <Image width={60} height={60} src="/logo.png" alt="Logo"/>
      </div>
      <div className=' flex flex-1 justify-center items-center'>
      {/* hidden lg:flex */}
      <ul className='flex justify-end gap-5 items-center w-full '>
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
