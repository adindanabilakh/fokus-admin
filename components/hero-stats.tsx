"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stat {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  trend: number;
  history: number[];
}

export function HeroStats() {
  const [stats, setStats] = useState<Stat[]>([
    { title: "Total UMKMs", value: 0, icon: Users, trend: 0, history: [0] },
    { title: "Active UMKMs", value: 0, icon: Activity, trend: 0, history: [0] },
    {
      title: "Total Products",
      value: 0,
      icon: ShoppingBag,
      trend: 0,
      history: [0],
    },
    { title: "Revenue", value: 0, icon: DollarSign, trend: 0, history: [0] },
  ]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/umkms`);
        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        console.log("Fetched UMKM Stats:", data); // ✅ Debugging

        // ✅ Hitung Total & Active UMKMs dari data
        const totalUMKMs = data.length;
        const activeUMKMs = data.filter(
          (umkm: any) => umkm.status === "Active"
        ).length;

        // ✅ Dummy data history & trend (bisa diupdate nanti)
        const newStats: Stat[] = [
          {
            title: "Total UMKMs",
            value: totalUMKMs,
            icon: Users,
            trend: (totalUMKMs - 100) / 100,
            history: [90, 100, 110, 120, totalUMKMs],
          },
          {
            title: "Active UMKMs",
            value: activeUMKMs,
            icon: Activity,
            trend: (activeUMKMs - 80) / 80,
            history: [70, 75, 80, 85, activeUMKMs],
          },
          {
            title: "Total Products",
            value: 5678,
            icon: ShoppingBag,
            trend: -1.5,
            history: [100, 120, 110, 130, 125, 135, 128],
          },
          {
            title: "Revenue",
            value: 123456,
            icon: DollarSign,
            trend: 7.8,
            history: [50000, 60000, 75000, 90000, 100000, 115000, 123456],
          },
        ];

        setStats(newStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} stat={stat} index={index} />
      ))}
    </div>
  );
}

// ✅ Perbaiki props agar TypeScript mengenali formatnya
interface StatCardProps {
  stat: Stat;
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 },
    });
    const timer = setTimeout(() => {
      animateValue(0, stat.value, 1500);
    }, index * 200);
    return () => clearTimeout(timer);
  }, [controls, stat.value, index]);

  const animateValue = (start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          <motion.div animate={controls}>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stat.title === "Revenue" ? "$" : ""}
            {count.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <TrendIndicator value={stat.trend} />
            <span className="text-sm text-muted-foreground">
              {Math.abs(stat.trend)}% from last month
            </span>
          </div>
          <MiniChart data={stat.history} className="mt-4" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TrendIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div
      className={`flex items-center ${
        isPositive
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      }`}
    >
      {isPositive ? (
        <TrendingUp className="h-4 w-4 mr-1" />
      ) : (
        <TrendingDown className="h-4 w-4 mr-1" />
      )}
    </div>
  );
}

function MiniChart({
  data,
  className,
}: {
  data: number[];
  className?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  return (
    <div className={`flex items-end space-x-1 h-8 ${className}`}>
      {data.map((value, index) => {
        const height = range === 0 ? 50 : ((value - min) / range) * 100;
        return (
          <div
            key={index}
            className="w-2 bg-primary/25 rounded-sm"
            style={{ height: `${height}%` }}
          >
            <div
              className="w-full bg-primary rounded-sm transition-all duration-500"
              style={{ height: "0%" }}
            />
          </div>
        );
      })}
    </div>
  );
}
