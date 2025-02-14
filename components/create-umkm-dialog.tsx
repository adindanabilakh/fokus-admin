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

interface Category {
  id: number;
  name: string;
}

interface CreateUMKMDialogProps {
  onCreateUMKM: (newUMKM: {
    name: string;
    type: string;
    status: string;
    address: string;
    location_url: string;
    email: string;
    password: string;
  }) => void;
}

export function CreateUMKMDialog({ onCreateUMKM }: CreateUMKMDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // 🔥 Tambah state loading

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  // ✅ Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Invalid category format:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, [API_BASE_URL]);

  // ✅ Default Password
  const generatePassword = () => "password123";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !type || !location || !email) {
      toast({
        title: "Creation Failed",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const password = generatePassword();
    const newUMKM = {
      name,
      type,
      status: "Pending",
      address: location,
      location_url: `https://maps.google.com/?q=${encodeURIComponent(
        location
      )}`,
      email,
      password,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Login Required",
        description: "You need to log in first!",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/umkms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUMKM),
      });

      if (!res.ok) throw new Error("Failed to create UMKM");

      const createdUMKM = await res.json();
      console.log("UMKM Created:", createdUMKM); // Debugging

      await onCreateUMKM(createdUMKM);
      // 🔥 Refetch data setelah berhasil

      toast({
        title: "UMKM Created",
        description: `${name} has been added successfully.`,
      });

      // Reset form dan tutup modal
      setName("");
      setType("");
      setLocation("");
      setEmail("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating UMKM:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create UMKM. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Create New UMKM</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New UMKM</DialogTitle>
          <DialogDescription>
            Enter the details of the new UMKM here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
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
                Category
              </Label>
              <Select value={type || undefined} onValueChange={setType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select UMKM category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories
                      .filter((category) => category.name.trim() !== "")
                      .map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem disabled value="none">
                      Loading categories...
                    </SelectItem>
                  )}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create UMKM"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
