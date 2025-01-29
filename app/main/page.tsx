import { Suspense } from 'react'

import Loading from "./loading"

const Main = () => {
  return (
    
    <Suspense fallback={<Loading />}>
    <div></div>
   </Suspense>
  )
}

export default Main