import express from "express";
import {
  createDish,
  deleteDish,
  getDish,
  getDishes,
  updateDish,
} from "../controllers/dish.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createDishSchema,
  getDishesSchema,
  updateDishSchema,
} from "../validations/dish.validation.js";

const router = express.Router();

// Public routes
router.get("/", validate(getDishesSchema), getDishes);
router.get("/:id", getDish);

// Protected routes (Admin/Chef)
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("image"),
  validate(createDishSchema),
  createDish
);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("image"),
  validate(updateDishSchema),
  updateDish
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteDish
);

export default router;
