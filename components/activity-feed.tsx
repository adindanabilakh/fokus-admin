"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  { id: 1, action: "New UMKM registered", name: "Batik Madura", time: "2 minutes ago" },
  { id: 2, action: "Updated profile", name: "Kopi Aceh", time: "1 hour ago" },
  { id: 3, action: "Added new product", name: "Kerajinan Bali", time: "3 hours ago" },
  { id: 4, action: "Completed verification", name: "Tenun Songket", time: "1 day ago" },
  { id: 5, action: "Received new order", name: "Bakso Malang", time: "2 days ago" },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.name}</p>
              </div>
              <span className="text-xs text-muted-foreground ml-auto">{activity.time}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

