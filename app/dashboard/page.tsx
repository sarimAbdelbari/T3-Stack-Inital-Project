import { auth } from '@/lib/auth'
import React from 'react'
import { redirect } from 'next/navigation';
async function Dashboard() {

  const session = await auth();




  if (!session) redirect('/login');


  return (
    <></>
  )
}

export default Dashboard