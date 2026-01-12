"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { resetPasswordSchema } from "@/lib/validations/auth.validation";
import authService from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Token de réinitialisation manquant");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        password: data.password,
      });
      toast.success("Mot de passe mis à jour avec succès !");
      router.push("/login");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Une erreur est survenue";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-secondary-900">Lien invalide</h2>
        <p className="text-secondary-500">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
        <Button
          onClick={() => router.push("/forgot-password")}
          variant="outline"
        >
          Demander un nouveau lien
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold font-outfit text-secondary-900">
          Nouveau mot de passe
        </h2>
        <p className="text-secondary-500">
          Veuillez choisir un nouveau mot de passe sécurisé.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nouveau mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Réinitialiser le mot de passe
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
