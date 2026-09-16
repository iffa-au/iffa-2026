import React from 'react'
import Header from '../components/header'
import { Footer } from '../components/footer'

const RootLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        {/* The header is fixed and its height changes with the breakpoint, so this
            tracks the measured value it publishes rather than a literal. */}
        <main className="flex-1 pt-[var(--header-h)]">
          {children}
        </main>
        <Footer />
    </div>
  )
}

export default RootLayout
