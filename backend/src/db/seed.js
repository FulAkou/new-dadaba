import { randomUUID } from "crypto";
import { hashPassword } from "../lib/bcrypt.js";
import { db } from "../lib/db.js";
import { users } from "../lib/schema.js";

async function seed() {
  try {
    console.log("🌱 Démarrage du seed...");

    // Créer un utilisateur admin
    const adminPassword = await hashPassword("admin123");
    const adminId = randomUUID();

    const [admin] = await db
      .insert(users)
      .values({
        id: adminId,
        name: "Admin",
        email: "ffeli6518@gmail.com",
        password: adminPassword,
        telephone: "7712345679",
        role: "ADMIN",
        emailConfirmed: true,
      })
      .returning();

    console.log("✅ Utilisateur admin créé:", admin.email);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    process.exit(1);
  }
}

seed();
