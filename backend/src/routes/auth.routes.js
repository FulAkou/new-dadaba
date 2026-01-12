import express from "express";
import {
  confirmEmail,
  forgotPassword,
  getMe,
  resendConfirmation,
  resetPassword,
  signin,
  signup,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/signin", validate(signinSchema), signin);
router.get("/me", authenticate, getMe);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/confirm", confirmEmail);
router.post("/resend-confirmation", resendConfirmation);

export default router;
