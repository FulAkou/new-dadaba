import { randomUUID } from "crypto";
import { and, desc, eq, ilike, inArray, sql, gte, lte, or } from "drizzle-orm";
import cloudinary from "../lib/cloudinary.js";
import { db } from "../lib/db.js";
import { dishes, users, reviews, reviewReplies } from "../lib/schema.js";

const uploadBufferToCloudinary = (buffer, folder = "dishes") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const getDishes = async (req, res, next) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      userId,
      page = 1,
      limit = 10,
    } = req.query;
    const skip = (page - 1) * limit;

    const filters = [];
    if (search) {
      filters.push(
        or(
          ilike(dishes.name, `%${search}%`),
          ilike(dishes.description, `%${search}%`)
        )
      );
    }
    if (minPrice !== undefined) filters.push(gte(dishes.price, parseFloat(minPrice)));
    if (maxPrice !== undefined) filters.push(lte(dishes.price, parseFloat(maxPrice)));
    if (userId) filters.push(eq(dishes.userId, userId));

    const whereClause = filters.length ? and(...filters) : undefined;

    const [dishRows, countRows] = await Promise.all([
      db.query.dishes.findMany({
        where: whereClause,
        offset: parseInt(skip),
        limit: parseInt(limit),
        orderBy: desc(dishes.createdAt),
        with: {
          user: { columns: { id: true, name: true } },
          reviews: { columns: { id: true } },
        },
      }),
      db
        .select({ count: sql`count(*)::int` })
        .from(dishes)
        .where(whereClause),
    ]);

    const total = countRows?.[0]?.count || 0;

    const normalized = dishRows.map((dish) => ({
      ...dish,
      _count: { reviews: dish.reviews?.length || 0 },
    }));

    res.json({
      dishes: normalized,
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

export const getDish = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dish = await db.query.dishes.findFirst({
      where: eq(dishes.id, id),
      with: {
        user: { columns: { id: true, name: true } },
      },
    });

    if (!dish) {
      return res.status(404).json({ error: "Plat non trouvé" });
    }

    const approvedReviews = await db.query.reviews.findMany({
      where: and(eq(reviews.dishId, id), eq(reviews.status, "APPROVED")),
      orderBy: [desc(reviews.featured), desc(reviews.createdAt)],
      limit: 20,
      with: {
        user: { columns: { id: true, name: true } },
        replies: {
          with: {
            user: { columns: { id: true, name: true } },
          },
        },
      },
    });

    const reviewCountRow = await db
      .select({ count: sql`count(*)::int` })
      .from(reviews)
      .where(eq(reviews.dishId, id));

    const reviewCount = reviewCountRow?.[0]?.count || 0;

    res.json({
      ...dish,
      reviews: approvedReviews,
      _count: { reviews: reviewCount },
    });
  } catch (error) {
    next(error);
  }
};

export const createDish = async (req, res, next) => {
  try {
    const { name, description, imageUrl, price } = req.body;
    const userId = req.user.id;

    const DEFAULT_IMAGE =
      process.env.DEFAULT_DISH_IMAGE ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";

    // Use provided imageUrl if any, otherwise default
    let finalImageUrl = imageUrl || DEFAULT_IMAGE;

    // Try to upload file buffer to Cloudinary when available and configured
    if (req.file && req.file.buffer) {
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        try {
          const result = await uploadBufferToCloudinary(
            req.file.buffer,
            "dishes"
          );
          finalImageUrl = result.secure_url;
        } catch (err) {
          console.error("Cloudinary upload failed:", err);
          // Fallback to provided imageUrl or default image
        }
      } else {
        console.warn(
          "Cloudinary not configured, storing image as base64 in DB for dev use"
        );
        try {
          if (req.file && req.file.buffer) {
            finalImageUrl = `data:${
              req.file.mimetype
            };base64,${req.file.buffer.toString("base64")}`;
          }
        } catch (err) {
          console.error("Failed to convert image to base64:", err);
        }
      }
    }

    const dishId = randomUUID();
    await db.insert(dishes).values({
      id: dishId,
      name,
      description,
      imageUrl: finalImageUrl,
      price: parseFloat(price),
      userId,
    });

    const dish = await db.query.dishes.findFirst({
      where: eq(dishes.id, dishId),
      with: {
        user: { columns: { id: true, name: true } },
      },
    });

    res.status(201).json(dish);
  } catch (error) {
    next(error);
  }
};

export const updateDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, price } = req.body;

    // Check if dish exists
    const existingDish = await db.query.dishes.findFirst({
      where: eq(dishes.id, id),
    });

    if (!existingDish) {
      return res.status(404).json({ error: "Plat non trouvé" });
    }

    const DEFAULT_IMAGE =
      process.env.DEFAULT_DISH_IMAGE ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";

    // Start from provided imageUrl or existing image or default
    let finalImageUrl = imageUrl || existingDish.imageUrl || DEFAULT_IMAGE;

    if (req.file && req.file.buffer) {
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        try {
          const result = await uploadBufferToCloudinary(
            req.file.buffer,
            "dishes"
          );
          finalImageUrl = result.secure_url;
        } catch (err) {
          console.error("Cloudinary upload failed:", err);
          // Keep existing image
        }
      } else {
        console.warn(
          "Cloudinary not configured, storing uploaded image as base64 in DB for dev use"
        );
        try {
          if (req.file && req.file.buffer) {
            finalImageUrl = `data:${
              req.file.mimetype
            };base64,${req.file.buffer.toString("base64")}`;
          }
        } catch (err) {
          console.error("Failed to convert image to base64:", err);
        }
      }
    }

    await db
      .update(dishes)
      .set({
        ...(name && { name }),
        ...(description && { description }),
        ...(finalImageUrl && { imageUrl: finalImageUrl }),
        ...(price !== undefined && { price: parseFloat(price) }),
      })
      .where(eq(dishes.id, id));

    const dish = await db.query.dishes.findFirst({
      where: eq(dishes.id, id),
      with: {
        user: { columns: { id: true, name: true } },
      },
    });

    res.json(dish);
  } catch (error) {
    next(error);
  }
};

export const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.delete(dishes).where(eq(dishes.id, id));

    res.json({ message: "Plat supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};
