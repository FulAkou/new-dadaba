import dotenv from "dotenv";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Chemin vers le dossier drizzle à la racine du projet
const migrationsFolder = join(__dirname, "../../drizzle");

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL n'est pas définie dans les variables d'environnement");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

const db = drizzle(pool);

async function runMigrations() {
  try {
    console.log("🔄 Application des migrations...");
    console.log(`📁 Dossier migrations: ${migrationsFolder}`);
    
    await migrate(db, { migrationsFolder });
    
    console.log("✅ Migrations appliquées avec succès");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de l'application des migrations:", error);
    // Si le dossier migrations n'existe pas encore, c'est normal pour la première fois
    if (error.message?.includes("ENOENT") || error.message?.includes("no such file")) {
      console.log("ℹ️  Aucune migration trouvée. Utilisez 'npm run db:generate' pour créer des migrations.");
      console.log("ℹ️  Ou utilisez 'npm run db:push' pour synchroniser directement le schéma.");
      process.exit(0); // Exit avec succès car c'est normal
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

