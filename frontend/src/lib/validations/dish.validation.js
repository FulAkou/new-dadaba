import { z } from "zod";

export const dishSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  price: z.coerce.number().positive("Le prix doit être positif"),
  imageUrl: z.string().url("URL d'image invalide").optional().or(z.literal("")),
});
