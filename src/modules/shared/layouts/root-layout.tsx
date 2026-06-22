import React from 'react'
import Header from '../components/header'
import { Footer } from '../components/footer'

const RootLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-[88px]">
          {children}
        </main>
        <Footer />
    </div>
  )
}

export default RootLayout