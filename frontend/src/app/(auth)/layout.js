import { ChefHat } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pt-20">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="text-primary-500 w-10 h-10" />
          <span className="text-3xl font-bold font-outfit text-secondary-900 tracking-tight">
            Dadaba National
          </span>
        </Link>
        <p className="mt-2 text-secondary-500 font-medium">
          L'excellence culinaire à portée de clic
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-secondary-200/50 p-8 md:p-10 border border-secondary-100">
        {children}
      </div>

      <div className="mt-12 text-sm text-secondary-900">
        &copy; 2026 Dadaba National. Tous droits réservés.
      </div>
    </div>
  );
}
