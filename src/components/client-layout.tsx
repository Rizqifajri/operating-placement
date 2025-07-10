'use client'

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [pathname]) 

  if (isLoggedIn === null) {
    return null 
  }

  const showHeader = isLoggedIn && pathname !== "/login"

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  )
}
