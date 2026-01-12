"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      // Redirect to user dashboard if not admin
      router.push(user ? `/dashboard/${user.id}` : "/");
    }
  }, [isAdmin, isAuthenticated, isLoading, router]);

  if (!isMounted) return null;

  if (!isAdmin && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-secondary-50 text-center space-y-6">
        <div className="bg-red-100 p-4 rounded-full text-red-500">
          <ShieldAlert className="w-16 h-16" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-outfit text-secondary-900">
            Accès Refusé
          </h1>
          <p className="text-secondary-500 max-w-md mx-auto">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à
            cette zone. Celle-ci est réservée aux administrateurs.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          Retour au Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <AdminSidebar />
      <main className="pl-72 min-h-screen">
        <div className="p-8 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
