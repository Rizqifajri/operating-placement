'use client'

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import clsx from "clsx"
import { Search } from "lucide-react"

import { Input } from "./ui/input"
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    document.cookie = "isLoggedIn=; Max-Age=0; path=/"
    router.push("/login")
  }

  return (
    <header className="w-full h-auto sticky top-0 z-50 border-b border bg-white backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <span className="font-semibold">Operation Placement</span>
          </div>
          <nav className="flex items-center gap-6">
            <ul className="flex items-center gap-4 text-sm font-medium text-gray-600">
              <li>
                <Link
                  href="/"
                  className={clsx(
                    "hover:text-black transition-colors",
                    pathname === "/" && "text-black font-semibold"
                  )}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/table-data"
                  className={clsx(
                    "hover:text-black transition-colors",
                    pathname === "/table-data" && "text-black font-semibold"
                  )}
                >
                  Table Data
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-white border text-white placeholder-gray-400 w-64"
            />
          </div>

          {/* Avatar + Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 rounded-full cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-sm text-red-500 hover:bg-red-100"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  )
}
