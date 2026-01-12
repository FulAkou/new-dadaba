import express from "express";
import {
  createJobApplication,
  getJobApplications,
} from "../controllers/application.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", upload.single("cv"), createJobApplication);
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  getJobApplications
);

export default router;
