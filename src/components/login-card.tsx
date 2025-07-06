'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react" // spinner icon

export function CardLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulasi proses login async
    setTimeout(() => {
      if (email === "cretivoxcreative@gmail.com" && password === "cretivox") {
        localStorage.setItem("isLoggedIn", "true")
        document.cookie = "isLoggedIn=true; path=/"
        router.push("/dashboard")
      } else {
        alert("Invalid credentials")
      }

      setIsLoading(false)
    }, 1500) // delay animasi
  }

  return (
    <Card className="w-full max-w-sm bg-white text-black cursor-pointer hover:bg-white border border-fuchsia-500 border-r-4 border-b-4">
      <CardHeader>
        <CardTitle className="text-xl md:text-3xl">Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-black cursor-pointer hover:bg-white border border-fuchsia-500 border-r-4 border-b-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
