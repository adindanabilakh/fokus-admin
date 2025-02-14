"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Coffee, Shirt, Palette, Leaf, Sofa, MoreHorizontal, Search, List, Grid } from "lucide-react"

// Mock data for UMKMs
const umkmData = [
  {
    id: 1,
    name: "Warung Tegal",
    type: "Food & Beverage",
    status: "Active",
    icon: Coffee,
    location: "Jakarta",
    registrationDate: "2023-01-15",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Batik Pekalongan",
    type: "Textile",
    status: "Pending",
    icon: Shirt,
    location: "Pekalongan",
    registrationDate: "2023-02-20",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Kerajinan Cirebon",
    type: "Handicraft",
    status: "Inactive",
    icon: Palette,
    location: "Cirebon",
    registrationDate: "2023-03-10",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Kopi Gayo",
    type: "Agriculture",
    status: "Active",
    icon: Leaf,
    location: "Aceh",
    registrationDate: "2023-04-05",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Mebel Jepara",
    type: "Furniture",
    status: "Active",
    icon: Sofa,
    location: "Jepara",
    registrationDate: "2023-05-12",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function AllUMKMs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const router = useRouter()

  const filteredUMKMs = umkmData.filter((umkm) => umkm.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleViewDetails = (id: number) => {
    router.push(`/umkms/${id}`)
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">All UMKMs</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search UMKMs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("card")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "list" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUMKMs.map((umkm) => (
                    <TableRow key={umkm.id} className="cursor-pointer" onClick={() => handleViewDetails(umkm.id)}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <umkm.icon className="h-5 w-5" />
                          <span>{umkm.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{umkm.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            umkm.status === "Active"
                              ? "default"
                              : umkm.status === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {umkm.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{umkm.location}</TableCell>
                      <TableCell>{umkm.registrationDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewDetails(umkm.id)
                              }}
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUMKMs.map((umkm) => (
                  <Card
                    key={umkm.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => handleViewDetails(umkm.id)}
                  >
                    <CardContent className="p-0">
                      <Image
                        src={umkm.image || "/placeholder.svg"}
                        alt={`${umkm.name} showcase`}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{umkm.name}</h3>
                          <Badge
                            variant={
                              umkm.status === "Active"
                                ? "default"
                                : umkm.status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {umkm.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <umkm.icon className="h-4 w-4 mr-2" />
                          <span>{umkm.type}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{umkm.location}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

