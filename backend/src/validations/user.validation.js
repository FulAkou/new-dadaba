import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .optional(),
    email: z.string().email("Email invalide").optional(),
    telephone: z
      .string()
      .regex(
        /^[0-9]{10}$/,
        "Le numéro de téléphone doit contenir exactement 10 chiffres"
      )
      .optional(),
    avatarUrl: z.string().url("URL invalide").optional(),
  }),
});

export const createUserSchema = z.object({
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
    role: z.enum(["USER", "STAFF", "ADMIN", "SUPER_ADMIN"]).optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    telephone: z
      .string()
      .regex(
        /^[0-9]{10}$/,
        "Le numéro de téléphone doit contenir exactement 10 chiffres"
      )
      .optional(),
    role: z.enum(["USER", "STAFF", "ADMIN", "SUPER_ADMIN"]).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
