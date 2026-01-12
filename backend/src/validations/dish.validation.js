import { z } from "zod";

export const createDishSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    description: z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères"),
    imageUrl: z.string().url("URL d'image invalide").optional(),
    price: z.preprocess(
      (val) => parseFloat(val),
      z.number().positive("Le prix doit être positif")
    ),
  }),
});

export const updateDishSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    imageUrl: z.preprocess((val) => (val === "" ? undefined : val), z.string().url().optional()),
    price: z.preprocess(
      (val) => (val === undefined || val === "" ? undefined : parseFloat(val)),
      z.number().positive("Le prix doit être positif").optional()
    ),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const getDishesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
});
