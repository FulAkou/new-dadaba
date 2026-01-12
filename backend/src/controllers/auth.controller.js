import crypto, { randomUUID } from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { comparePassword, hashPassword } from "../lib/bcrypt.js";
import { db } from "../lib/db.js";
import { generateToken } from "../lib/jwt.js";
import { sendConfirmationEmail } from "../lib/mailer.js";
import { users } from "../lib/schema.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, telephone } = req.body;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        name,
        email,
        password: hashedPassword,
        telephone,
        emailConfirmed: true, // Auto-confirm email
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        telephone: users.telephone,
        role: users.role,
        createdAt: users.createdAt,
      });

    // Generate token for auto-login
    const token = generateToken(user.id);

    // Return user and token immediately
    res.status(201).json({
      message: "Inscription réussie",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
        telephone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        message:
          "Si cet email existe, un lien de réinitialisation a été envoyé",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1h

    await db
      .update(users)
      .set({ resetToken, resetTokenExpires })
      .where(eq(users.id, user.id));

    // Send reset email
    try {
      await (
        await import("../lib/mailer.js")
      ).sendResetPasswordEmail(user, resetToken);
    } catch (err) {
      console.error("Failed to send reset email:", err);
    }

    res.json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await db.query.users.findFirst({
      where: and(
        eq(users.resetToken, token),
        gt(users.resetTokenExpires, new Date())
      ),
    });

    if (!user) {
      return res.status(400).json({ error: "Token invalide ou expiré" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      })
      .where(eq(users.id, user.id));

    res.json({ message: "Votre mot de passe a été réinitialisé avec succès" });
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (req, res, next) => {
  try {
    const token = req.query.token;
    const frontend = process.env.FRONTEND_URL || "http://localhost:3001";
    if (!token)
      return res.redirect(
        `${frontend}/auth?confirmed=0&error=${encodeURIComponent(
          "Token manquant"
        )}`
      );

    const user = await db.query.users.findFirst({
      where: eq(users.confirmationToken, token),
    });

    if (!user) {
      return res.redirect(
        `${frontend}/auth?confirmed=0&error=${encodeURIComponent(
          "Token invalide ou expiré"
        )}`
      );
    }

    if (
      user.confirmationTokenExpires &&
      user.confirmationTokenExpires < new Date()
    ) {
      return res.redirect(
        `${frontend}/auth?confirmed=0&error=${encodeURIComponent(
          "Token expiré"
        )}`
      );
    }

    await db
      .update(users)
      .set({
        emailConfirmed: true,
        confirmationToken: null,
        confirmationTokenExpires: null,
      })
      .where(eq(users.id, user.id));

    // Redirect to frontend login page with a success flag
    return res.redirect(`${frontend}/auth?confirmed=1`);
  } catch (error) {
    next(error);
  }
};

export const resendConfirmation = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email manquant" });

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user)
      return res.status(200).json({
        message: "Si l'email existe, un email de confirmation a été envoyé",
      });

    if (user.emailConfirmed) {
      return res
        .status(200)
        .json({ message: "Votre adresse email est déjà confirmée" });
    }

    // Generate new token
    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await db
      .update(users)
      .set({ confirmationToken, confirmationTokenExpires })
      .where(eq(users.id, user.id));

    try {
      await sendConfirmationEmail(user, confirmationToken);
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }

    return res.status(200).json({
      message: "Si l'email existe, un email de confirmation a été envoyé",
    });
  } catch (error) {
    next(error);
  }
};
