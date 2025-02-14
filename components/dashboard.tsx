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

  const handleAddCategory = (newCategory: Category) => {
    // This function will be passed down to the CreateCategoryDialog
    // The actual implementation is in the UMKMCategories component
    toast({
      title: "Category Added",
      description: `${newCategory.name} has been added to the categories.`,
    });
    setIsCategoryDialogOpen(false);
  };

  return (
    <div className="h-screen bg-background">
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
      <AddUMKMModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <CreateCategoryDialog
        onAddCategory={handleAddCategory}
        isOpen={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      />
    </div>
  );
}
