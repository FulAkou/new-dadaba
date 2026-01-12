import dotenv from "dotenv";
import { inArray } from "drizzle-orm";
import nodemailer from "nodemailer";
import { db } from "./db.js";
import { users } from "./schema.js";

dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_FROM;

let transporter = null;

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  console.warn(
    "SMTP not configured. Emails will not be sent. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in .env to enable."
  );
}

export async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    console.warn("sendMail skipped because transporter is not configured");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Failed to send email:", err);
    // Do not throw to avoid breaking main flow
  }
}

export async function sendOrderNotificationToAdmins(order) {
  try {
    const admins = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(inArray(users.role, ["ADMIN", "SUPER_ADMIN"]));

    if (!admins.length) return;

    const subject = `Nouvelle commande ${order.secretCode}`;
    const text = `Nouvelle commande ${order.secretCode} par ${order.user.name}\nTotal: ${order.total}\nVoir la commande dans le panel admin.`;
    const html = `<p>Nouvelle commande <strong>${order.secretCode}</strong> par <strong>${order.user.name}</strong></p>
      <p>Total: <strong>${order.total} FCFA</strong></p>
      <p><a href="${process.env.FRONTEND_URL}/admin/orders/${order.id}">Voir la commande</a></p>`;

    for (const admin of admins) {
      await sendMail({ to: admin.email, subject, text, html });
    }
  } catch (err) {
    console.error(
      "Failed to send order notifications to admins via email:",
      err
    );
  }
}

export async function sendOrderConfirmedNotificationToAdmins(order) {
  try {
    const admins = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(inArray(users.role, ["ADMIN", "SUPER_ADMIN"]));

    if (!admins.length) return;

    const subject = `Commande confirmée ${order.secretCode}`;
    const text = `La commande ${order.secretCode} a été confirmée par ${order.user.name}.
Total: ${order.total}
Voir la commande dans le panel admin.`;
    const html = `<p>La commande <strong>${order.secretCode}</strong> a été confirmée par <strong>${order.user.name}</strong></p>
      <p>Total: <strong>${order.total} FCFA</strong></p>
      <p><a href="${process.env.FRONTEND_URL}/admin/orders/${order.id}">Voir la commande</a></p>`;

    for (const admin of admins) {
      await sendMail({ to: admin.email, subject, text, html });
    }
  } catch (err) {
    console.error(
      "Failed to send order-confirmed notifications to admins via email:",
      err
    );
  }
}

export async function sendConfirmationEmail(user, token) {
  try {
    const backend = process.env.BACKEND_URL || process.env.BACKEND_URL;
    const confirmUrl = `${backend}/api/auth/confirm?token=${token}`;

    const subject = "Confirmez votre adresse email";
    const text = `Bonjour ${
      user.name || ""
    },\n\nMerci de vous être inscrit(e) sur Dadaba National. Pour confirmer votre adresse e-mail, cliquez sur le lien suivant : ${confirmUrl}\n\nSi vous n'avez pas créé ce compte, ignorez ce message.`;
    const html = `<p>Bonjour ${user.name || ""},</p>
      <p>Merci de vous être inscrit(e) sur <strong>Dadaba National</strong>. Pour confirmer votre adresse e-mail, cliquez sur le lien suivant :</p>
      <p><a href="${confirmUrl}">Confirmer mon adresse email</a></p>
      <p>Si vous n'avez pas créé ce compte, ignorez ce message.</p>`;

    await sendMail({ to: user.email, subject, text, html });
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }
}

export async function sendResetPasswordEmail(user, token) {
  try {
    const frontend = process.env.FRONTEND_URL || process.env.FRONTEND_URL;
    const resetUrl = `${frontend}/reset-password?token=${token}`;

    const subject = "Réinitialisation de votre mot de passe";
    const text = `Bonjour ${
      user.name || ""
    },\n\nVous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour choisir un nouveau mot de passe : ${resetUrl}\n\nCe lien expire dans 1 heure.\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message.`;
    const html = `<p>Bonjour ${user.name || ""},</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte <strong>Dadaba National</strong>.</p>
      <p>Cliquez sur le lien suivant pour choisir un nouveau mot de passe :</p>
      <p><a href="${resetUrl}">Réinitialiser mon mot de passe</a></p>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>`;

    await sendMail({ to: user.email, subject, text, html });
  } catch (err) {
    console.error("Failed to send reset password email:", err);
  }
}
