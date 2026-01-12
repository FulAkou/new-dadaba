import express from "express";
import {
  confirmOrder,
  createOrder,
  deleteOrder,
  getMyOrders,
  getOrder,
  getOrderBySecretCode,
  getOrders,
  updateOrder,
} from "../controllers/order.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createOrderSchema,
  getOrdersSchema,
  updateOrderSchema,
} from "../validations/order.validation.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes (for authenticated users)
router.get("/secret-code/:secretCode", getOrderBySecretCode);

// User routes
router.get("/my-orders", validate(getOrdersSchema), getMyOrders);
router.get("/", validate(getOrdersSchema), getOrders);
router.get("/:id", getOrder);
router.post("/", validate(createOrderSchema), createOrder);
router.post("/:id/confirm", confirmOrder);

// Admin/Staff routes
router.put(
  "/:id",
  authorize("ADMIN", "SUPER_ADMIN", "STAFF"),
  validate(updateOrderSchema),
  updateOrder
);
router.patch(
  "/:id/status",
  authorize("ADMIN", "SUPER_ADMIN", "STAFF"),
  validate(updateOrderSchema),
  updateOrder
);
router.delete("/:id", authorize("ADMIN", "SUPER_ADMIN"), deleteOrder);

export default router;
