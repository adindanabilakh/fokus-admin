"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Header } from "./header";
import { HeroStats } from "./hero-stats";
import { UMKMCategories } from "./umkm-categories";
import { UMKMGrid } from "./umkm-grid";
import { UMKMMap } from "./umkm-map";
import { ActivityFeed } from "./activity-feed";
import { AddUMKMModal } from "./add-umkm-modal";
import { CreateCategoryDialog } from "./create-category-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Coffee, Shirt, Palette, Leaf, Sofa, Scissors } from "lucide-react";



// 🚀 Default kategori yang bisa dipilih
const iconOptions = [
  { name: "Food & Beverage", icon: Coffee, color: "bg-red-500" },
  { name: "Textile", icon: Shirt, color: "bg-blue-500" },
  { name: "Handicraft", icon: Palette, color: "bg-yellow-500" },
  { name: "Agriculture", icon: Leaf, color: "bg-green-500" },
  { name: "Furniture", icon: Sofa, color: "bg-purple-500" },
  { name: "Fashion", icon: Scissors, color: "bg-pink-500" },
];


export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "n") {
      event.preventDefault();
      setIsCategoryDialogOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  interface Category {
    name: string;
    icon: React.ElementType;
    color: string;
    percentage: number;
  }

  const handleAddCategory = (newCategory: { name: string }) => {
    // 🚀 Cari kategori yang sesuai di iconOptions
    const matchedCategory = iconOptions.find(
      (cat) => cat.name === newCategory.name
    );
  
    const category: Category = {
      name: newCategory.name,
      icon: matchedCategory?.icon || Coffee, // Default icon jika tidak ditemukan
      color: matchedCategory?.color || "bg-gray-500", // Default warna jika tidak ditemukan
      percentage: 0, // Baru dibuat, default 0%
    };
  
    toast({
      title: "Kategori Ditambahkan",
      description: `${category.name} berhasil ditambahkan.`,
    });
  
    setIsCategoryDialogOpen(false);
  };

  return (
    <div className="bg-background overflow-y-hidden">
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
      {/* <AddUMKMModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
      {/* <CreateCategoryDialog
        onAddCategory={handleAddCategory}
        isOpen={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      /> */}
    </div>
  );
}
