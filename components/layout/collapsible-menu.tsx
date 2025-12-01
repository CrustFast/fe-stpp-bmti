"use client"

import * as React from "react"
import { ChevronDown, LucideIcon } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface SubItem {
  title: string
  url: string
}

interface CollapsibleMenuProps {
  title: string
  icon: LucideIcon
  items: SubItem[]
  isActive?: boolean
  iconClassName?: string
}

export function CollapsibleMenu({ title, icon: Icon, items, isActive = false, iconClassName }: CollapsibleMenuProps) {
  const [isOpen, setIsOpen] = React.useState(isActive)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLUListElement>(null)
  const chevronRef = React.useRef<SVGSVGElement>(null)

  const { contextSafe } = useGSAP({ scope: containerRef })

  const toggleOpen = contextSafe(() => {
    const newOpenState = !isOpen
    setIsOpen(newOpenState)

    if (newOpenState) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(chevronRef.current, {
        rotation: 180,
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      })
      gsap.to(chevronRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.in",
      })
    }
  })

  React.useEffect(() => {
    if (isOpen) {
      gsap.set(contentRef.current, { height: "auto", opacity: 1 })
      gsap.set(chevronRef.current, { rotation: 180 })
    } else {
      gsap.set(contentRef.current, { height: 0, opacity: 0 })
      gsap.set(chevronRef.current, { rotation: 0 })
    }
  }, [])

  return (
    <div ref={containerRef}>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={toggleOpen} className="justify-between group">
          <div className="flex items-center gap-2">
            <Icon className={iconClassName} />
            <span>{title}</span>
          </div>
          <ChevronDown
            ref={chevronRef}
            className="h-4 w-4 transition-transform duration-200"
          />
        </SidebarMenuButton>
        <div className="overflow-hidden h-0 opacity-0" >
          <ul ref={contentRef} className="border-l border-sidebar-border ml-4 pl-2 mt-1 space-y-1">
            {items.map((item) => (
              <li key={item.title}>
                <SidebarMenuButton asChild size="sm">
                  <a href={item.url}>
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </li>
            ))}
          </ul>
        </div>
      </SidebarMenuItem>
    </div>
  )
}
