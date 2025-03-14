import React, { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        {children}
    </div>
  )
}

export default layout