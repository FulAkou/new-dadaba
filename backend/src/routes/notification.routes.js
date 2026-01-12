import express from "express";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

// Get notifications for current user
router.get("/", getNotifications);

// Mark notification as read
router.put("/:id/read", markAsRead);

export default router;
