"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProvinceData {
  id: string
  name: string
  totalUMKM: number
  growth: number
  categories: {
    name: string
    count: number
  }[]
}

const provinces: ProvinceData[] = [
  {
    id: "jawa-barat",
    name: "Jawa Barat",
    totalUMKM: 423,
    growth: 12.5,
    categories: [
      { name: "Food & Beverage", count: 185 },
      { name: "Handicraft", count: 122 },
      { name: "Fashion", count: 116 },
    ],
  },
  {
    id: "jawa-tengah",
    name: "Jawa Tengah",
    totalUMKM: 389,
    growth: 10.2,
    categories: [
      { name: "Food & Beverage", count: 165 },
      { name: "Textile", count: 124 },
      { name: "Handicraft", count: 100 },
    ],
  },
  {
    id: "jawa-timur",
    name: "Jawa Timur",
    totalUMKM: 467,
    growth: 11.8,
    categories: [
      { name: "Food & Beverage", count: 198 },
      { name: "Fashion", count: 145 },
      { name: "Handicraft", count: 124 },
    ],
  },
  {
    id: "sumatera-utara",
    name: "Sumatera Utara",
    totalUMKM: 312,
    growth: 8.3,
    categories: [
      { name: "Agriculture", count: 145 },
      { name: "Food & Beverage", count: 98 },
      { name: "Textile", count: 69 },
    ],
  },
  {
    id: "sumatera-selatan",
    name: "Sumatera Selatan",
    totalUMKM: 278,
    growth: 9.5,
    categories: [
      { name: "Agriculture", count: 132 },
      { name: "Food & Beverage", count: 89 },
      { name: "Handicraft", count: 57 },
    ],
  },
]

export function UMKMMap() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>UMKM Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Province</TableHead>
              <TableHead className="text-right">Total UMKMs</TableHead>
              <TableHead className="text-right">Growth</TableHead>
              <TableHead>Top Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {provinces.map((province) => {
              const topCategory = province.categories.reduce((prev, current) =>
                current.count > prev.count ? current : prev,
              )

              return (
                <TableRow
                  key={province.id}
                  className={`cursor-pointer transition-colors
                    ${selectedProvince === province.id ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => setSelectedProvince(selectedProvince === province.id ? null : province.id)}
                >
                  <TableCell className="font-medium">{province.name}</TableCell>
                  <TableCell className="text-right">{province.totalUMKM.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-600 dark:text-green-400">+{province.growth}%</span>
                  </TableCell>
                  <TableCell>{topCategory.name}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <AnimatePresence>
          {selectedProvince && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              {provinces.map(
                (province) =>
                  province.id === selectedProvince && (
                    <Card key={province.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{province.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Total UMKMs: {province.totalUMKM.toLocaleString()}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="ml-2 text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
                          >
                            +{province.growth}% Growth
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {province.categories.map((category) => (
                            <Card key={category.name}>
                              <CardContent className="p-4">
                                <div className="text-sm font-medium text-muted-foreground">{category.name}</div>
                                <div className="text-2xl font-bold mt-1">{category.count}</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ),
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

