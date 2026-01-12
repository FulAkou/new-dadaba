"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { loginSchema } from "@/lib/validations/auth.validation";
import authService from "@/services/auth.service";
import { useAuthStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.token);
      toast.success("Bon retour parmi nous !");

      if (
        response.user.role === "ADMIN" ||
        response.user.role === "SUPER_ADMIN"
      ) {
        router.push("/admin");
      } else {
        router.push(`/dashboard/${response.user.id}`);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Identifiants invalides";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-outfit text-secondary-900">
          Bienvenue
        </h2>
        <p className="text-secondary-500">Connectez-vous pour continuer</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-1">
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full group" isLoading={isLoading}>
          Se connecter
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-secondary-100" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-secondary-400">
            Ou continuer avec
          </span>
        </div>
      </div>

      <p className="text-center text-secondary-500 text-sm">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
        >
          S&apos;inscrire gratuitement
        </Link>
      </p>
    </div>
  );
}
