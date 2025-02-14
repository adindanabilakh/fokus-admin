"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";
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

// ✅ Custom Toast Component
function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </motion.div>
  );
}

interface Category {
  id: number;
  name: string;
}

export function UMKMCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setToastMessage({ message: "Gagal mengambil kategori", type: "error" });
    }
  };

  const handleAddCategory = async (newCategory: { name: string }) => {
    try {
      const data = await addCategory({
        name: newCategory.name,
      });

      setCategories([...categories, data.category]);
      setToastMessage({
        message: `${newCategory.name} telah ditambahkan`,
        type: "success",
      });
      setIsCategoryDialogOpen(false);
    } catch (error) {
      setToastMessage({ message: "Gagal menambah kategori", type: "error" });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    try {
      await deleteCategory(deleteCategoryId);
      setCategories(categories.filter((cat) => cat.id !== deleteCategoryId));
      setToastMessage({
        message: "Kategori berhasil dihapus",
        type: "success",
      });
    } catch (error) {
      setToastMessage({ message: "Gagal menghapus kategori", type: "error" });
    } finally {
      setDeleteCategoryId(null);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategory) return;
    try {
      await updateCategory(editCategory.id, { name: editCategory.name });
      setCategories(
        categories.map((cat) =>
          cat.id === editCategory.id ? editCategory : cat
        )
      );
      setToastMessage({
        message: "Kategori berhasil diperbarui",
        type: "success",
      });
    } catch (error) {
      setToastMessage({ message: "Gagal memperbarui kategori", type: "error" });
    } finally {
      setEditCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ✅ Toast */}
      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} />
      )}

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

                {/* ✅ Dialog Konfirmasi Hapus */}
                <Dialog>
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
