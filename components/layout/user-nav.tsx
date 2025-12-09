"use client"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Button,
} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

interface User {
  id: number
  name: string
  email: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export function UserNav() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users`)
        if (!res.ok) throw new Error("Failed to fetch user")
        const json = await res.json()
        if (json.data && json.data.length > 0) {
          setUser(json.data[0])
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user?.name || "@shadcn"} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "shadcn"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "m@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
