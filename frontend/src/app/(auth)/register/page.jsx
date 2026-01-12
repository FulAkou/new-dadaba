"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { registerSchema } from "@/lib/validations/auth.validation";
import authService from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success("Compte créé avec succès ! Veuillez vous connecter.");
      router.push("/login");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Une erreur est survenue lors de l'inscription";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-outfit text-secondary-900">
          Créer un compte
        </h2>
        <p className="text-secondary-500">
          Rejoignez notre festival de saveurs
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nom complet"
          placeholder="Jean Dupont"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Téléphone"
          type="tel"
          placeholder="06 12 34 56 78"
          error={errors.telephone?.message}
          {...register("telephone")}
          maxLength={10}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirmation"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>
        <Button
          type="submit"
          className="w-full group mt-2"
          isLoading={isLoading}
        >
          S&apos;inscrire
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <p className="text-center text-secondary-500 text-sm">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
