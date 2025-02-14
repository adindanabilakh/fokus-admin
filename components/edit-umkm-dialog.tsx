"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export interface UMKM {
  id: number;
  name: string;
  type: string;
  location: string;
}

interface EditUMKMDialogProps {
  umkmId: number;
  onUpdate: () => void; // ✅ Callback untuk refresh data setelah edit
}

export function EditUMKMDialog({ umkmId, onUpdate }: EditUMKMDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Tambahkan loading state

  const { toast } = useToast();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  // 🔥 Fetch UMKM berdasarkan `id` saat modal dibuka
  useEffect(() => {
    async function fetchUMKMDetail() {
      if (!umkmId) {
        console.error("UMKM ID tidak valid:", umkmId);
        return;
      }

      console.log("Fetching UMKM with ID:", umkmId);

      try {
        const res = await fetch(`${API_BASE_URL}/api/umkms/${umkmId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch UMKM. Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched UMKM Data:", data);

        // ⬇️ Pastikan state hanya diperbarui jika data berubah
        setName(data.name || "");
        setType(data.type || "");
        setLocation(data.location || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching UMKM:", error);
        toast({
          title: "Error",
          description: "UMKM tidak ditemukan atau terjadi error.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }

    fetchUMKMDetail();
  }, [umkmId]); // ⬅️ Tambahkan dependensi agar hanya re-fetch saat ID berubah

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "You need to log in first!",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedUMKM = { name, type, location };

      const res = await fetch(`${API_BASE_URL}/api/umkms/${umkmId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUMKM),
      });

      if (!res.ok) throw new Error("Failed to update UMKM");

      toast({
        title: "UMKM Updated",
        description: `${name} has been successfully updated.`,
      });

      onUpdate(); // ✅ Refresh data setelah edit
    } catch (error) {
      console.error("Error updating UMKM:", error);
      toast({
        title: "Error",
        description: "Failed to update UMKM. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit UMKM</DialogTitle>
          <DialogDescription>
            Update the details of the UMKM here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center py-4">Loading data...</p>
        ) : name || type || location ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select UMKM type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="textile">Textile</SelectItem>
                    <SelectItem value="handicraft">Handicraft</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Save changes"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-center py-4 text-red-500">
            Failed to load data, please try again.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
