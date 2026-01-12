"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { useAuthStore, useCartStore } from "@/store";
import { ChefHat, Menu, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isAdminRoute = pathname?.startsWith("/admin");

  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdminRoute) return null;

  const navLinks = [
    { name: "A propos", href: "/about" },
    { name: "Mes Commandes", href: "/orders", protected: true },
  ];

  // Prevent hydration mismatch by using isMounted for auth-dependent checks
  const isAuth = isMounted && isAuthenticated;
  const itemCount = isMounted ? cartItemCount : 0;

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "glass py-3 shadow-lg shadow-secondary-900/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <ChefHat className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold font-outfit text-secondary-900">
            Dadaba National
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(
            (link) =>
              (!link.protected || isAuth) && (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-primary-500",
                    pathname === link.href
                      ? "text-primary-500"
                      : "text-secondary-600"
                  )}
                >
                  {link.name}
                </Link>
              )
          )}

          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
            <Link
              href="/admin"
              className="text-slate-600 hover:text-primary font-medium transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 text-secondary-600 hover:text-primary-500 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuth ? (
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex"
                onClick={logout}
              >
                Déconnexion
              </Button>
              <Link href={user ? `/dashboard/${user.id}` : "/dashboard"}>
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 border-2 border-primary-200">
                  <User className="w-5 h-5" />
                </div>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">S&apos;inscrire</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 md:hidden text-secondary-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-secondary-100 p-6 flex flex-col gap-4 animate-slide-down md:hidden">
          {navLinks.map(
            (link) =>
              (!link.protected || isAuth) && (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-semibold",
                    pathname === link.href
                      ? "text-primary-500"
                      : "text-secondary-600"
                  )}
                >
                  {link.name}
                </Link>
              )
          )}
          <hr className="border-secondary-100" />
          {!isAuth ? (
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">S&apos;inscrire</Button>
              </Link>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
            >
              Déconnexion
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
