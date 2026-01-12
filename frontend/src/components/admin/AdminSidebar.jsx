"use client";

import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store";
import {
  ChefHat,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Star,
  Users,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Gestion Plats", href: "/admin/dishes", icon: Utensils },
    { name: "Commandes", href: "/admin/orders", icon: ShoppingBag },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
    { name: "Candidatures", href: "/admin/applications", icon: FileText },
    { name: "Avis Clients", href: "/admin/reviews", icon: Star },
  ];

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-secondary-950 text-white flex flex-col z-50">
      {/* Brand */}
      <div className="p-8 pb-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary-500 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary-500/20">
            <ChefHat className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black font-outfit leading-none tracking-tight">
              ADMIN
            </h1>
            <p className="text-[10px] text-primary-500 font-bold tracking-[0.2em] uppercase">
              Dadaba National
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-grow px-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group",
                isActive
                  ? "bg-primary-500 text-white shadow-xl shadow-primary-500/20"
                  : "text-secondary-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                <span className="font-semibold text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 space-y-4">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 text-secondary-400 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-semibold text-sm">Paramètres</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
