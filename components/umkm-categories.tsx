"use client"

import { motion } from "framer-motion"
import { Coffee, Shirt, Palette, Leaf, Sofa, Scissors, PieChart } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const categories = [
  { name: "Food & Beverage", icon: Coffee, color: "bg-red-500", percentage: 30 },
  { name: "Textile", icon: Shirt, color: "bg-blue-500", percentage: 20 },
  { name: "Handicraft", icon: Palette, color: "bg-yellow-500", percentage: 15 },
  { name: "Agriculture", icon: Leaf, color: "bg-green-500", percentage: 18 },
  { name: "Furniture", icon: Sofa, color: "bg-purple-500", percentage: 10 },
  { name: "Fashion", icon: Scissors, color: "bg-pink-500", percentage: 7 },
]

export function UMKMCategories() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">UMKM Categories</h2>
        <motion.div
          className="bg-card text-card-foreground p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <PieChart className="h-6 w-6" />
        </motion.div>
      </div>
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <div className="grid gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold">{category.name}</h3>
                  <span className="text-sm font-medium">{category.percentage}%</span>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

