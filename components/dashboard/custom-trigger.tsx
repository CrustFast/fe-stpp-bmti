"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { AlignLeft } from "lucide-react"

export function CustomSidebarTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className="-ml-1 size-7"
      onClick={toggleSidebar}
    >
      <AlignLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
