"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "./mode-toggle"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "All UMKMs", href: "/umkms" },
]

export function Sidebar() {
  const pathname = usePathname()
  // const [openSubmenu, setOpenSubmenu] = useState<string | null>(null) //Removed

  return (
    <motion.aside
      className="w-64 bg-card text-card-foreground border-r border-border shadow-sm flex flex-col h-screen"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center p-6 border-b border-border">
        <h1 className="text-2xl font-bold">UMKM Admin</h1>
      </div>
      <ScrollArea className="flex-grow px-4">
        <nav className="space-y-2 py-4">
          {menuItems.map((item, index) => (
            <div key={item.label}>
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${pathname === item.href ? "bg-accent text-accent-foreground" : ""}`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-border space-y-2">
        <ModeToggle />
        <Separator className="my-2" />
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & Support
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </motion.aside>
  )
}

