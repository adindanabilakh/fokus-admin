"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  umkmName: string
  type: string
  timestamp: string
  status: "pending" | "approved" | "rejected"
  details: {
    ownerName: string
    category: string
    location: string
    employeeCount: number
    annualRevenue: number
  }
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    umkmName: "Batik Pekalongan",
    type: "New Registration",
    timestamp: "2 minutes ago",
    status: "pending",
    details: {
      ownerName: "Siti Nurhayati",
      category: "Textile",
      location: "Pekalongan, Central Java",
      employeeCount: 15,
      annualRevenue: 500000000,
    },
  },
  {
    id: "2",
    umkmName: "Kopi Aceh",
    type: "New Registration",
    timestamp: "1 hour ago",
    status: "pending",
    details: {
      ownerName: "Ahmad Rizki",
      category: "Food & Beverage",
      location: "Banda Aceh, Aceh",
      employeeCount: 8,
      annualRevenue: 300000000,
    },
  },
  {
    id: "3",
    umkmName: "Kerajinan Bali",
    type: "New Registration",
    timestamp: "3 hours ago",
    status: "pending",
    details: {
      ownerName: "Made Dewi",
      category: "Handicraft",
      location: "Ubud, Bali",
      employeeCount: 12,
      annualRevenue: 450000000,
    },
  },
  {
    id: "4",
    umkmName: "Tenun Songket",
    type: "New Registration",
    timestamp: "1 day ago",
    status: "pending",
    details: {
      ownerName: "Putri Sari",
      category: "Textile",
      location: "Palembang, South Sumatra",
      employeeCount: 20,
      annualRevenue: 750000000,
    },
  },
  {
    id: "5",
    umkmName: "Bakso Malang",
    type: "New Registration",
    timestamp: "2 days ago",
    status: "pending",
    details: {
      ownerName: "Budi Santoso",
      category: "Food & Beverage",
      location: "Malang, East Java",
      employeeCount: 5,
      annualRevenue: 200000000,
    },
  },
]

interface NotificationSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationSidebar({ isOpen, onClose }: NotificationSidebarProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState<Notification | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(384) // 24rem (w-96) in pixels
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  const handleReview = (notification: Notification) => {
    setCurrentReview(notification)
    setReviewDialogOpen(true)
  }

  const handleApprove = (notificationId: string) => {
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, status: "approved" as const } : n)))
    if (currentReview?.id === notificationId) {
      setReviewDialogOpen(false)
      setCurrentReview(null)
    }
  }

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        const newWidth = window.innerWidth - mouseMoveEvent.clientX
        setSidebarWidth(Math.min(Math.max(newWidth, 300), 600))
      }
    },
    [isResizing],
  )

  useEffect(() => {
    window.addEventListener("mousemove", resize)
    window.addEventListener("mouseup", stopResizing)
    return () => {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [resize, stopResizing])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 bg-background border-l border-border shadow-lg z-50 flex"
            style={{ width: `${sidebarWidth}px` }}
          >
            <div
              ref={resizeHandleRef}
              className="absolute left-0 top-0 bottom-0 w-4 cursor-ew-resize group"
              onMouseDown={startResizing}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-border transition-all duration-300 group-hover:w-2 group-hover:bg-primary" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <GripVertical className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-64px)] p-4">
                {notifications.map((notification) => (
                  <Card key={notification.id} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{notification.umkmName}</h3>
                          <p className="text-sm text-muted-foreground">{notification.type}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                          <Badge
                            variant={notification.status === "approved" ? "default" : "secondary"}
                            className="mt-2"
                          >
                            {notification.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleReview(notification)}>
                            Review
                          </Button>
                          {notification.status === "pending" && (
                            <Button variant="default" size="sm" onClick={() => handleApprove(notification.id)}>
                              <Check className="mr-2 h-4 w-4" /> Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review UMKM Registration</DialogTitle>
            <DialogDescription>Please review the details of the UMKM registration for approval.</DialogDescription>
          </DialogHeader>
          {currentReview && (
            <div className="py-4">
              <h3 className="font-semibold text-lg">{currentReview.umkmName}</h3>
              <p className="text-sm text-muted-foreground">{currentReview.type}</p>
              <p className="text-sm text-muted-foreground mb-4">Submitted: {currentReview.timestamp}</p>
              <div className="space-y-2">
                <p>
                  <strong>Owner:</strong> {currentReview.details.ownerName}
                </p>
                <p>
                  <strong>Category:</strong> {currentReview.details.category}
                </p>
                <p>
                  <strong>Location:</strong> {currentReview.details.location}
                </p>
                <p>
                  <strong>Employees:</strong> {currentReview.details.employeeCount}
                </p>
                <p>
                  <strong>Annual Revenue:</strong> Rp {currentReview.details.annualRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Close
            </Button>
            {currentReview && currentReview.status === "pending" && (
              <Button onClick={() => handleApprove(currentReview.id)}>
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

