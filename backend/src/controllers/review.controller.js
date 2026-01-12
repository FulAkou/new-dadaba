import { randomUUID } from "crypto";
import { and, desc, eq, sql, asc } from "drizzle-orm";
import { db } from "../lib/db.js";
import { reviews, reviewReplies, dishes, users } from "../lib/schema.js";

export const getReviews = async (req, res, next) => {
  try {
    const {
      dishId,
      userId,
      status,
      featured,
      page = 1,
      limit = 10,
    } = req.query;
    const skip = (page - 1) * limit;

    const filters = [];
    if (dishId) filters.push(eq(reviews.dishId, dishId));
    if (userId) filters.push(eq(reviews.userId, userId));
    if (status) filters.push(eq(reviews.status, status));
    if (featured !== undefined)
      filters.push(eq(reviews.featured, featured === "true"));

    const whereClause = filters.length ? and(...filters) : undefined;

    const [reviewRows, totalRows] = await Promise.all([
      db.query.reviews.findMany({
        where: whereClause,
        offset: parseInt(skip),
        limit: parseInt(limit),
        orderBy: [desc(reviews.featured), desc(reviews.createdAt)],
        with: {
          user: { columns: { id: true, name: true } },
          dish: {
            columns: { id: true, name: true, imageUrl: true },
          },
          replies: {
            orderBy: asc(reviewReplies.createdAt),
            with: {
              user: { columns: { id: true, name: true } },
            },
          },
        },
      }),
      db
        .select({ count: sql`count(*)::int` })
        .from(reviews)
        .where(whereClause),
    ]);

    const total = totalRows?.[0]?.count || 0;

    res.json({
      reviews: reviewRows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsBulk = getReviews;

export const getReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, id),
      with: {
        user: { columns: { id: true, name: true } },
        dish: { columns: { id: true, name: true, imageUrl: true } },
        replies: {
          orderBy: asc(reviewReplies.createdAt),
          with: {
            user: { columns: { id: true, name: true } },
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { rating, comment, dishId } = req.body;
    const userId = req.user.id;

    // Check if dish exists
    const dish = await db.query.dishes.findFirst({
      where: eq(dishes.id, dishId),
    });

    if (!dish) {
      return res.status(404).json({ error: "Plat non trouvé" });
    }

    // Check if user already reviewed this dish
    const existingReview = await db.query.reviews.findFirst({
      where: and(eq(reviews.userId, userId), eq(reviews.dishId, dishId)),
    });

    if (existingReview) {
      return res
        .status(409)
        .json({ error: "Vous avez déjà laissé un avis pour ce plat" });
    }

    const reviewId = randomUUID();
    await db.insert(reviews).values({
      id: reviewId,
      rating: parseInt(rating),
      comment,
      dishId,
      userId,
      status: "PENDING",
    });

    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
      with: {
        user: { columns: { id: true, name: true } },
        dish: { columns: { id: true, name: true, imageUrl: true } },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment, status, featured } = req.body;

    // Check if review exists
    const existingReview = await db.query.reviews.findFirst({
      where: eq(reviews.id, id),
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }

    // Only allow users to update their own reviews (unless admin)
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      if (existingReview.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Vous ne pouvez modifier que vos propres avis" });
      }
      // Users can't change status or featured
      if (status !== undefined || featured !== undefined) {
        return res
          .status(403)
          .json({ error: "Vous ne pouvez pas modifier le statut de l'avis" });
      }
    }

    await db
      .update(reviews)
      .set({
        ...(rating !== undefined && { rating: parseInt(rating) }),
        ...(comment && { comment }),
        ...(status && { status }),
        ...(featured !== undefined && { featured }),
      })
      .where(eq(reviews.id, id));

    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, id),
      with: {
        user: { columns: { id: true, name: true } },
        dish: { columns: { id: true, name: true, imageUrl: true } },
      },
    });

    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, id),
    });

    if (!review) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }

    // Only allow users to delete their own reviews (unless admin)
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      if (review.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Vous ne pouvez supprimer que vos propres avis" });
      }
    }

    await db.delete(reviews).where(eq(reviews.id, id));

    res.json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};

export const createReviewReply = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check if review exists
    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    });

    if (!review) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }

    // Only chefs and admins can reply
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return res
        .status(403)
        .json({ error: "Seuls les administrateurs peuvent répondre" });
    }

    const replyId = randomUUID();
    const [reply] = await db
      .insert(reviewReplies)
      .values({
        id: replyId,
        content,
        reviewId,
        userId,
      })
      .returning({
        id: reviewReplies.id,
        content: reviewReplies.content,
        reviewId: reviewReplies.reviewId,
        userId: reviewReplies.userId,
        createdAt: reviewReplies.createdAt,
        updatedAt: reviewReplies.updatedAt,
      });

    const author = { id: user.id, name: user.name };
    res.status(201).json({ ...reply, user: author });

  } catch (error) {
    next(error);
  }
};
