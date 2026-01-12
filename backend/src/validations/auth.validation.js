import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    telephone: z
      .string()
      .regex(
        /^[0-9]{10}$/,
        "Le numéro de téléphone doit contenir exactement 10 chiffres"
      ),
    role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
  }),
});

export const signinSchema = z.object({
  body: z.object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Email invalide"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token manquant"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(6, "Le mot de passe actuel doit contenir au moins 6 caractères"),
    newPassword: z
      .string()
      .min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
  }),
});
