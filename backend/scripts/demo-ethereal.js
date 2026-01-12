import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

async function runDemo() {
  try {
    console.log("Creating Ethereal test account...");
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("Fetching admin recipients from DB...");
    const admins = await prisma.user.findMany({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
      select: { email: true, name: true },
    });

    if (!admins.length) {
      console.log("No admin users found to send to.");
      return;
    }

    const fakeOrder = {
      id: "demo-order-1",
      secretCode: "FF-DEMO-0001",
      total: 4200,
      user: { name: "Demo User" },
    };

    console.log(`Sending test email to ${admins.length} admin(s)...`);

    for (const admin of admins) {
      const subject = `Test: Nouvelle commande ${fakeOrder.secretCode}`;
      const text = `Bonjour ${admin.name},\n\nCeci est un e-mail de test pour la commande ${fakeOrder.secretCode} (total ${fakeOrder.total} FCFA).`;
      const html = `<p>Bonjour <strong>${admin.name}</strong>,</p><p>Ceci est un e-mail de test pour la commande <strong>${fakeOrder.secretCode}</strong> (total <strong>${fakeOrder.total} FCFA</strong>).</p>`;

      const info = await transporter.sendMail({
        from: "no-reply@foodfest.local",
        to: admin.email,
        subject,
        text,
        html,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`Email sent to ${admin.email}. Preview URL: ${previewUrl}`);
    }

    console.log("Demo finished.");
  } catch (err) {
    console.error("Demo failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

runDemo();
