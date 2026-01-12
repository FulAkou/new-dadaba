import express from "express";
import {
  createReview,
  createReviewReply,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/review.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createReviewReplySchema,
  createReviewSchema,
  getReviewsSchema,
  updateReviewSchema,
} from "../validations/review.validation.js";

const router = express.Router();

// Public routes
router.get("/", validate(getReviewsSchema), getReviews);
router.get(
  "/all",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(getReviewsSchema),
  getReviews
);
router.get("/:id", getReview);

// Protected routes
router.post("/", authenticate, validate(createReviewSchema), createReview);
router.put("/:id", authenticate, validate(updateReviewSchema), updateReview);
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(updateReviewSchema),
  updateReview
);
router.delete("/:id", authenticate, deleteReview);

// Reply routes (Chef/Admin only)
router.post(
  "/:reviewId/replies",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(createReviewReplySchema),
  createReviewReply
);

export default router;
