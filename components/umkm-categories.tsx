"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateCategoryDialog } from "./create-category-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"; // ✅ Fix: Import useToast()
import axios from "axios";

// ✅ Ambil BASE_URL dari .env
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ✅ Fetch CSRF Token sebelum request API
const fetchCSRFToken = async () => {
  try {
    await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

const checkAdminAuth = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token not found");
    return;
  }

  try {
    await fetchCSRFToken();
    const res = await axios.get(`${API_BASE_URL}/api/admin/me`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "X-XSRF-TOKEN": decodeURIComponent(getCSRFToken() || ""),
      },
    });

    console.log("Admin Authenticated:", res.data);
  } catch (error) {
    console.error("Admin not authenticated", error);
  }
};

// ✅ Ambil CSRF Token dari cookies
const getCSRFToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
};

interface Category {
  id: number;
  name: string;
}

export function UMKMCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast(); // ✅ Fix: Gunakan useToast()
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Fetch kategori dengan CSRF
  const fetchCategories = async () => {
    try {
      await fetchCSRFToken();
      const res = await axios.get(`${API_BASE_URL}/api/categories`, {
        withCredentials: true,
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(getCSRFToken() || ""),
          Accept: "application/json",
        },
      });
      setCategories(res.data);
    } catch (error: any) {
      let message = "Gagal mengambil kategori";
      if (error.response?.status === 419) {
        message = "CSRF Token Mismatch. Refresh dan coba lagi.";
      } else if (error.response?.status === 401) {
        message = "Unauthorized. Silakan login.";
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleAddCategory = async (newCategory: { name: string }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Login required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchCSRFToken();
      const res = await axios.post(
        `${API_BASE_URL}/api/categories`,
        { name: newCategory.name },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 Pastikan ini ada
            "X-XSRF-TOKEN": decodeURIComponent(getCSRFToken() || ""),
            Accept: "application/json",
          },
        }
      );

      setCategories([...categories, res.data.category]);
      toast({
        title: "Success",
        description: "Kategori berhasil ditambahkan.",
      });
      setIsCategoryDialogOpen(false);
    } catch (error: any) {
      let message = "Gagal menambah kategori";
      if (error.response?.status === 419)
        message = "CSRF Token Mismatch. Refresh dan coba lagi.";
      if (error.response?.status === 401)
        message = "Unauthorized. Silakan login.";

      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Login required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchCSRFToken();
      await axios.delete(`${API_BASE_URL}/api/categories/${deleteCategoryId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 Pastikan ini ada
          "X-XSRF-TOKEN": decodeURIComponent(getCSRFToken() || ""),
          Accept: "application/json",
        },
      });

      setCategories(categories.filter((cat) => cat.id !== deleteCategoryId));
      toast({ title: "Success", description: "Kategori berhasil dihapus." });
    } catch (error: any) {
      let message = "Gagal menghapus kategori";
      if (error.response?.status === 419) {
        message = "CSRF Token Mismatch. Refresh dan coba lagi.";
      } else if (error.response?.status === 401) {
        message = "Unauthorized. Silakan login.";
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setDeleteCategoryId(null);
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategory) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Login required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchCSRFToken();
      await axios.put(
        `${API_BASE_URL}/api/categories/${editCategory.id}`,
        { name: editCategory.name },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 Pastikan ini ada
            "X-XSRF-TOKEN": decodeURIComponent(getCSRFToken() || ""),
            Accept: "application/json",
          },
        }
      );

      setCategories(
        categories.map((cat) =>
          cat.id === editCategory.id ? editCategory : cat
        )
      );
      toast({ title: "Success", description: "Kategori berhasil diperbarui." });
    } catch (error: any) {
      let message = "Gagal memperbarui kategori";
      if (error.response?.status === 419) {
        message = "CSRF Token Mismatch. Refresh dan coba lagi.";
      } else if (error.response?.status === 401) {
        message = "Unauthorized. Silakan login.";
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setEditCategory(null);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">UMKM Categories</h2>
        <CreateCategoryDialog
          onAddCategory={handleAddCategory}
          isOpen={isCategoryDialogOpen}
          onOpenChange={setIsCategoryDialogOpen}
        />
      </div>

      {/* ✅ Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 flex justify-between items-center">
              <CardContent className="flex items-center space-x-4 p-0">
                <div className="text-lg font-medium">{category.name}</div>
              </CardContent>

              <div className="flex space-x-2">
                {/* ✅ Edit Category Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditCategory(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Edit Kategori</DialogTitle>
                    <DialogDescription>
                      Ubah nama kategori ini.
                    </DialogDescription>
                    <Input
                      value={editCategory?.name || ""}
                      onChange={(e) =>
                        setEditCategory((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                    <div className="flex justify-end space-x-2">
                      <Button onClick={handleEditCategory}>Simpan</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={deleteCategoryId === category.id}
                  onOpenChange={(isOpen) =>
                    isOpen
                      ? setDeleteCategoryId(category.id)
                      : setDeleteCategoryId(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteCategoryId(category.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Hapus Kategori?</DialogTitle>
                    <DialogDescription>
                      Apakah Anda yakin ingin menghapus kategori ini? Tindakan
                      ini tidak dapat dibatalkan.
                    </DialogDescription>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setDeleteCategoryId(null)}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteCategory}
                      >
                        Hapus
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
