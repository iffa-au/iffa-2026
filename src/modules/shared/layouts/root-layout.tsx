import React from 'react'

const RootLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div>
        <div>SOME NAVBAR</div>
        {children}
    </div>
  )
}

export default RootLayout