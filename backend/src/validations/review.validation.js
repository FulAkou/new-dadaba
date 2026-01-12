import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1, 'Le commentaire est requis'),
    dishId: z.string().min(1, 'Le plat est requis'),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(1).optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
    featured: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const createReviewReplySchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Le contenu est requis'),
  }),
  params: z.object({
    reviewId: z.string(),
  }),
});

export const getReviewsSchema = z.object({
  query: z.object({
    dishId: z.string().optional(),
    userId: z.string().optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
    featured: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
});

