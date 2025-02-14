"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Coffee,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Check,
  X,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Mock data for UMKM details
const umkmDetails = {
  id: 1,
  name: "Warung Tegal",
  type: "Food & Beverage",
  status: "Pending",
  icon: Coffee,
  rating: 4.5,
  location: "Jakarta",
  phone: "+62 812-3456-7890",
  email: "info@warungtegal.com",
  website: "https://warungtegal.com",
  description:
    "Warung Tegal is a popular Indonesian food stall specializing in Tegal cuisine. Known for its delicious and affordable meals, it has become a favorite among locals and tourists alike.",
  products: [
    { name: "Nasi Goreng", price: 25000, rating: 4.7 },
    { name: "Soto Ayam", price: 20000, rating: 4.5 },
    { name: "Es Teh Manis", price: 5000, rating: 4.3 },
  ],
  financials: {
    monthlyRevenue: 50000000,
    yearlyGrowth: 15,
    employeeCount: 10,
  },
};

export default function UMKMDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [umkm, setUMKM] = useState(umkmDetails);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // In a real application, you would fetch the UMKM details here
    // using the ID from params.id
    console.log("Fetching UMKM with ID:", params.id);
  }, [params.id]);

  const handleApprove = () => {
    setUMKM({ ...umkm, status: "Approved" });
    toast({
      title: "UMKM Approved",
      description: `${umkm.name} has been approved successfully.`,
    });
  };

  const handleReject = () => {
    setUMKM({ ...umkm, status: "Rejected" });
    toast({
      title: "UMKM Rejected",
      description: `${umkm.name} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    // In a real application, you would delete the UMKM here
    toast({
      title: "UMKM Deleted",
      description: `${umkm.name} has been deleted successfully.`,
      variant: "destructive",
    });
    router.push("/umkms"); // Redirect to UMKM list page
  };

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center`}
                >
                  <umkm.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{umkm.name}</CardTitle>
                  <p className="text-muted-foreground">{umkm.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {umkm.status === "Pending" && (
                  <>
                    <Button
                      onClick={handleApprove}
                      variant="default"
                      className="flex items-center"
                    >
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      className="flex items-center"
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  variant="outline"
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Badge
                variant={
                  umkm.status === "Approved"
                    ? "default"
                    : umkm.status === "Rejected"
                    ? "destructive"
                    : "secondary"
                }
              >
                {umkm.status}
              </Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{umkm.rating}</span>
              </div>
            </div>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="space-y-4">
                  <p>{umkm.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{umkm.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      <span>{umkm.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      <span>{umkm.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      <a
                        href={umkm.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {umkm.website}
                      </a>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="products">
                <div className="space-y-4">
                  {umkm.products.map((product, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-muted-foreground">
                            Rp {product.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{product.rating}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="financials">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">Monthly Revenue</h3>
                        <p className="text-2xl font-bold">
                          Rp {umkm.financials.monthlyRevenue.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">Yearly Growth</h3>
                        <p className="text-2xl font-bold">
                          {umkm.financials.yearlyGrowth}%
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">Employee Count</h3>
                        <p className="text-2xl font-bold">
                          {umkm.financials.employeeCount}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this UMKM?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              UMKM and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
}
