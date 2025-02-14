"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Bell, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { NotificationSidebar } from "./notification-sidebar"

export function Header() {
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false)

  return (
    <>
      <motion.header
        className="bg-background p-4 shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search UMKMs..." className="pl-8" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button variant="ghost" className="w-10 h-10" onClick={() => setNotificationSidebarOpen(true)}>
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="w-10 h-10">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.header>
      <NotificationSidebar isOpen={notificationSidebarOpen} onClose={() => setNotificationSidebarOpen(false)} />
    </>
  )
}

