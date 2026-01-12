"use client";

import { useAuthStore } from "@/store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isMounted) return null;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-secondary-50">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-secondary-500 font-bold font-outfit uppercase tracking-widest text-xs">
          Authentification en cours...
        </p>
      </div>
    );
  }

  // If it's an admin route, the admin layout will handle its own sidebar
  if (isAdminRoute) {
    return children;
  }

  return (
    <div className="min-h-screen bg-secondary-50 pt-20">
      <Sidebar />
      <main className="pl-72 min-h-screen">
        <div className="p-8 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
