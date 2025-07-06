'use client'

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Cek status login di localStorage setiap kali pathname berubah
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [pathname]) // Re-run setiap kali route berubah

  if (isLoggedIn === null) {
    return null // atau ganti dengan <LoadingSpinner /> jika kamu punya
  }

  const showHeader = isLoggedIn && pathname !== "/login"

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  )
}
