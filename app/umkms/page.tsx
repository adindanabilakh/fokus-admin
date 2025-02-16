"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateUMKMDialog } from "@/components/create-umkm-dialog";
import { DeleteUMKMDialog } from "@/components/delete-umkm-dialog";
// import type { UMKM } from "@/components/edit-umkm-dialog";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UMKM {
  id: number;
  name: string;
  type: string;
  location: string;
  status: string; // ✅ Pastikan ada properti status
}

export default function AllUMKMs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [umkmData, setUMKMData] = useState<UMKM[]>([]);
  const router = useRouter();
  const [selectedUMKMId, setSelectedUMKMId] = useState<number | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  // ✅ Ambil CSRF token sebelum request pertama
  const fetchCSRFToken = async () => {
    try {
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  };

  // ✅ Ambil CSRF token dari cookies
  const getCSRFToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
  };

  // ✅ Ambil data UMKM dari API dengan CSRF
  const fetchUMKMs = async () => {
    try {
      await fetchCSRFToken(); // Pastikan CSRF token di-fetch dulu
      const res = await axios.get(`${API_BASE_URL}/api/umkms`, {
        withCredentials: true, // Pastikan cookies dikirim
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(getCSRFToken() || ""), // Wajib untuk CSRF
          Accept: "application/json",
        },
      });

      setUMKMData(res.data);
    } catch (error) {
      console.error("Error fetching UMKMs:", error);
    }
  };

  // 🔥 Fetch data saat pertama kali render
  useEffect(() => {
    fetchUMKMs();
  }, []);

  const handleDeleteUMKM = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "You need to log in first!",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetchCSRFToken();
      const res = await axios.delete(`${API_BASE_URL}/api/umkms/${id}`, {
        withCredentials: true,
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(getCSRFToken() || ""),
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) throw new Error(`Failed to delete UMKM`);

      fetchUMKMs(); // ✅ Refresh data setelah delete

      toast({
        title: "UMKM Deleted",
        description: "UMKM has been removed.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting UMKM:", error);
      toast({
        title: "Error",
        description: "Failed to delete UMKM. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (id: number) => {
    router.push(`/umkms/${id}`);
  };

  const filteredUMKMs = useMemo(() => {
    return umkmData.filter((umkm) =>
      umkm.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [umkmData, searchTerm]);

  const paginatedUMKMs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUMKMs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUMKMs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUMKMs.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
              <CreateUMKMDialog onCreateUMKM={fetchUMKMs} />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUMKMs.map((umkm) => (
                  <TableRow key={umkm.id}>
                    <TableCell>{umkm.name}</TableCell>
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
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(umkm.id)}
                      >
                        View
                      </Button>
                      <DeleteUMKMDialog
                        umkmId={umkm.id}
                        umkmName={umkm.name}
                        onDelete={handleDeleteUMKM}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
