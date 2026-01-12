"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { forgotPasswordSchema } from "@/lib/validations/auth.validation";
import authService from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSuccess(true);
      toast.success("Email envoyé !");
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

  if (isSuccess) {
    return (
      <div className="space-y-6 animate-slide-up text-center">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-primary-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-outfit text-secondary-900">
            Vérifiez vos emails
          </h2>
          <p className="text-secondary-500">
            Nous avons envoyé un lien de réinitialisation à votre adresse email.
          </p>
        </div>
        <Link href="/login" className="block">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour à la connexion
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold font-outfit text-secondary-900">
          Mot de passe oublié ?
        </h2>
        <p className="text-secondary-500">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Envoyer le lien
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-bold text-secondary-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
