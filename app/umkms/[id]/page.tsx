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
  Shirt,
  Palette,
  Leaf,
  Sofa,
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// 🔥 Mapping ikon berdasarkan tipe UMKM
const iconMap: { [key: string]: any } = {
  "Food & Beverage": Coffee,
  Textile: Shirt,
  Handicraft: Palette,
  Agriculture: Leaf,
  Furniture: Sofa,
};

interface Product {
  name: string;
  price: number;
  rating?: number;
}

export default function UMKMDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [umkm, setUMKM] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUMKMDetails() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/umkms/${params.id}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (res.ok) {
          setUMKM(data);
        } else {
          console.error("Failed to fetch UMKM details");
        }
      } catch (error) {
        console.error("Error fetching UMKM details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUMKMDetails();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/umkms/${umkm.id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete UMKM");
      toast({
        title: "UMKM Deleted",
        description: `${umkm.name} has been deleted.`,
        variant: "destructive",
      });
      router.push("/umkms");
    } catch (error) {
      console.error("Error deleting UMKM:", error);
    }
  };

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

  if (isLoading) {
    return <div className="text-center p-6">Loading UMKM Details...</div>;
  }

  if (!umkm) {
    return <div className="text-center p-6 text-red-500">UMKM Not Found</div>;
  }

  // 🔥 Pilih ikon sesuai tipe UMKM, default ke "Coffee" jika tidak ada yang cocok
  const Icon = iconMap[umkm.type] || Coffee;

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
                  <Icon className="h-6 w-6 text-primary" />
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
                <p>{umkm.description}</p>
              </TabsContent>
              <TabsContent value="products">
                {umkm.products?.map((product: Product, index: number) => (
                  <Card key={index}>
                    <CardContent>
                      <h3>{product.name}</h3>
                      <p>Rp {product.price.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="financials">
                <p>Monthly Revenue: Rp {umkm.financials?.monthlyRevenue}</p>
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
