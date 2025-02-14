"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "./header"
import { HeroStats } from "./hero-stats"
import { UMKMCategories } from "./umkm-categories"
import { UMKMGrid } from "./umkm-grid"
import { UMKMMap } from "./umkm-map"
import { ActivityFeed } from "./activity-feed"
import { AddUMKMModal } from "./add-umkm-modal"

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="h-screen bg-background">
      <motion.div
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        
        <main className="p-6 overflow-auto h-[calc(100vh-64px)]">
          <HeroStats />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <UMKMMap />
            <ActivityFeed />
          </div>
          <div className="mt-6 space-y-6">
            <UMKMCategories />
            <UMKMGrid />
          </div>
        </main>
      </motion.div>
      <AddUMKMModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

