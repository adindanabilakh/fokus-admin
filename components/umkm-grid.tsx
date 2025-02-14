"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coffee, Shirt, Palette, Leaf, Sofa, Scissors, Star, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const umkmData = [
  {
    id: 1,
    name: "Warung Tegal",
    type: "Food & Beverage",
    status: "Active",
    icon: Coffee,
    rating: 4.5,
    location: "Jakarta",
    phone: "+62 812-3456-7890",
  },
  {
    id: 2,
    name: "Batik Pekalongan",
    type: "Textile",
    status: "Active",
    icon: Shirt,
    rating: 4.8,
    location: "Pekalongan",
    phone: "+62 813-2345-6789",
  },
  {
    id: 3,
    name: "Kerajinan Cirebon",
    type: "Handicraft",
    status: "Inactive",
    icon: Palette,
    rating: 4.2,
    location: "Cirebon",
    phone: "+62 814-3456-7890",
  },
  {
    id: 4,
    name: "Kopi Gayo",
    type: "Agriculture",
    status: "Active",
    icon: Leaf,
    rating: 4.7,
    location: "Aceh",
    phone: "+62 815-4567-8901",
  },
  {
    id: 5,
    name: "Mebel Jepara",
    type: "Furniture",
    status: "Active",
    icon: Sofa,
    rating: 4.6,
    location: "Jepara",
    phone: "+62 816-5678-9012",
  },
  {
    id: 6,
    name: "Sepatu Bandung",
    type: "Fashion",
    status: "Inactive",
    icon: Scissors,
    rating: 4.3,
    location: "Bandung",
    phone: "+62 817-6789-0123",
  },
]

export function UMKMGrid() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">UMKM Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {umkmData.map((umkm, index) => (
          <motion.div
            key={umkm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className={`h-2 ${getColorForType(umkm.type)}`} />
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <umkm.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{umkm.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{umkm.type}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant={umkm.status === "Active" ? "default" : "secondary"}>{umkm.status}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{umkm.rating}</span>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === umkm.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2 mt-2"
                    >
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        {umkm.location}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {umkm.phone}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setExpandedId(expandedId === umkm.id ? null : umkm.id)}
                  >
                    {expandedId === umkm.id ? "Less Info" : "More Info"}
                  </Button>
                  <Link href={`/umkms/${umkm.id}`} passHref>
                    <Button variant="default" className="flex-1">
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function getColorForType(type: string) {
  switch (type) {
    case "Food & Beverage":
      return "bg-red-500"
    case "Textile":
      return "bg-blue-500"
    case "Handicraft":
      return "bg-yellow-500"
    case "Agriculture":
      return "bg-green-500"
    case "Furniture":
      return "bg-purple-500"
    case "Fashion":
      return "bg-pink-500"
    default:
      return "bg-gray-500"
  }
}

