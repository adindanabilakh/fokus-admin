"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ✅ Fetch CSRF Token sebelum request API (Mengatasi error 419)
const fetchCSRFToken = async () => {
  try {
    await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

// ✅ Ambil CSRF Token dari cookies
const getCSRFToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
};
interface UMKM {
  id: number;
  name: string;
  type: string;
  status: "Pending" | "Active" | "Rejected";
  owner_name: string;
  category: string;
  address: string;
  employee_count: number;
  annual_revenue: number;
  document?: string; // ✅ Tambahkan properti ini agar tidak error
}

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSidebar({
  isOpen,
  onClose,
}: NotificationSidebarProps) {
  const [umkms, setUMKMs] = useState<UMKM[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<UMKM | null>(null);
  const { toast } = useToast();

  // ✅ Fetch UMKM Pending
  useEffect(() => {
    async function fetchPendingUMKMs() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/umkms`, {
          withCredentials: true,
          headers: { Accept: "application/json" },
        });

        const pendingUMKMs = res.data.filter(
          (umkm: UMKM) => umkm.status === "Pending"
        );
        setUMKMs(pendingUMKMs);
      } catch (error) {
        console.error("Error fetching UMKM:", error);
        toast({
          title: "Error",
          description: "Failed to fetch UMKM data",
          variant: "destructive",
        });
      }
    }

    if (isOpen) fetchPendingUMKMs();
  }, [isOpen, toast]);

  // ✅ Tampilkan dialog review
  const handleReview = (umkm: UMKM) => {
    setCurrentReview(umkm);
    setReviewDialogOpen(true);
  };

  // ✅ Fungsi Approve UMKM
  const handleApprove = async () => {
    if (!currentReview) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Login required",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetchCSRFToken();
      await axios.post(
        `${API_BASE_URL}/api/umkms/${currentReview.id}/approve`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN": decodeURIComponent(getCSRFToken() || ""),
            Accept: "application/json",
          },
        }
      );

      setUMKMs((prev) => prev.filter((n) => n.id !== currentReview.id));
      setReviewDialogOpen(false);
      toast({ title: "Success", description: "UMKM has been approved." });
    } catch (error) {
      console.error("Error approving UMKM:", error);
      toast({
        title: "Error",
        description: "Failed to approve UMKM",
        variant: "destructive",
      });
    }
  };

  // ✅ Fungsi Reject UMKM
  const handleReject = async () => {
    if (!currentReview) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Login required",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetchCSRFToken();
      await axios.post(
        `${API_BASE_URL}/api/umkms/${currentReview.id}/reject`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN": decodeURIComponent(getCSRFToken() || ""),
            Accept: "application/json",
          },
        }
      );

      setUMKMs((prev) => prev.filter((n) => n.id !== currentReview.id));
      setReviewDialogOpen(false);
      toast({ title: "Rejected", description: "UMKM has been rejected." });
    } catch (error) {
      console.error("Error rejecting UMKM:", error);
      toast({
        title: "Error",
        description: "Failed to reject UMKM",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 bg-background border-l border-border shadow-lg z-50 flex w-96"
          >
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Pending Reviews
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-grow">
                <div className="p-4 space-y-4">
                  {umkms.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      No pending reviews
                    </p>
                  ) : (
                    umkms.map((umkm) => (
                      <Card key={umkm.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            {umkm.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                {umkm.type}
                              </p>
                              <Badge variant="secondary">{umkm.status}</Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReview(umkm)}
                            >
                              Review
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog Review */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review UMKM</DialogTitle>
            <DialogDescription>
              Review UMKM submission details.
            </DialogDescription>
          </DialogHeader>
          {currentReview && (
            <div className="grid grid-cols-2 gap-6">
              {/* 🔹 Kiri: Detail UMKM */}
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Owner:</span>
                  <span className="col-span-3">{currentReview.owner_name}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Category:</span>
                  <span className="col-span-3">{currentReview.category}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Location:</span>
                  <span className="col-span-3">{currentReview.address}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Employees:</span>
                  <span className="col-span-3">
                    {currentReview.employee_count}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Annual Revenue:</span>
                  <span className="col-span-3">
                    Rp {currentReview.annual_revenue?.toLocaleString() ?? "N/A"}
                  </span>
                </div>
              </div>

              {/* 🔹 Kanan: Document Preview */}
              {currentReview.document && (
                <div className="flex flex-col items-center space-y-4">
                  <h3 className="font-medium mb-2">Document</h3>
                  {currentReview.document.endsWith(".pdf") ? (
                    <iframe
                      src={`${API_BASE_URL}/storage/${currentReview.document}`}
                      className="w-full h-96 rounded-lg border"
                    />
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                      <img
                        src={`${API_BASE_URL}/storage/${currentReview.document}`}
                        alt="UMKM Document"
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Close
            </Button>
            {currentReview && currentReview.status === "Pending" && (
              <>
                <Button variant="destructive" onClick={handleReject}>
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
