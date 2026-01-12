"use client";

import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store";
import {
  ChefHat,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    {
      name: "Vue d&apos;ensemble",
      href: user ? `/dashboard/${user.id}` : "/dashboard",
      icon: LayoutDashboard,
      startsWith: "/dashboard",
    },
    { name: "Mes Commandes", href: "/orders", icon: ShoppingBag },
    { name: "Mon Profil", href: "/profile", icon: User },
  ];

  return (
    <aside className="w-72 h-screen fixed left-0 top-20 bg-white border-r border-secondary-100 flex flex-col z-40">
      {/* Brand */}
      <div className="p-8 pb-12">
        <Link href="/" className="flex items-center gap-2 group">
          <ChefHat className="text-primary-500 w-8 h-8 group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold font-outfit text-secondary-900">
            Dadaba National
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-grow px-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = item.startsWith
            ? pathname.startsWith(item.startsWith)
            : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group",
                isActive
                  ? "bg-primary-50 text-primary-600 border border-primary-100 shadow-sm shadow-primary-500/5"
                  : "text-secondary-500 hover:text-secondary-900 hover:bg-secondary-50"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                <span
                  className="font-bold text-sm"
                  dangerouslySetInnerHTML={{ __html: item.name }}
                />
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-secondary-100 space-y-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
