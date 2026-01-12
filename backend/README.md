# Backend API - Restaurant Management

API backend pour l'application de gestion de restaurant.

## Technologies

- **Node.js** avec Express
- **Drizzle ORM** pour la gestion de la base de données
- **PostgreSQL** (NeonDB)
- **Socket.io** pour les notifications en temps réel
- **JWT** pour l'authentification

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/database?sslmode=require
JWT_SECRET=votre_secret_jwt
FRONTEND_URL=http://localhost:3000
# ... autres variables
```

## Base de données

### Générer les migrations

Après avoir modifié le schéma dans `src/lib/schema.js` :

```bash
npm run db:generate
```

### Appliquer les migrations

```bash
npm run db:migrate
```

### Synchroniser directement le schéma (développement)

```bash
npm run db:push
```

### Seed la base de données

Créer des données initiales (admin, utilisateurs, plats, etc.) :

```bash
npm run db:seed
```

**Comptes créés par le seed :**
- Admin: `admin@restaurant.com` / `admin123`
- User: `user@restaurant.com` / `user123`

### Ouvrir Drizzle Studio

Interface graphique pour visualiser et gérer la base de données :

```bash
npm run db:studio
```

## Démarrage

### Développement

```bash
npm run dev
```

### Production

```bash
npm start
```

## Scripts disponibles

- `npm run dev` - Démarre le serveur en mode développement avec nodemon
- `npm start` - Démarre le serveur en mode production
- `npm run db:generate` - Génère les fichiers de migration SQL
- `npm run db:migrate` - Applique les migrations à la base de données
- `npm run db:push` - Synchronise directement le schéma (sans migrations)
- `npm run db:seed` - Peuple la base de données avec des données initiales
- `npm run db:studio` - Ouvre Drizzle Studio

## Structure du projet

```
backend/
├── src/
│   ├── controllers/     # Contrôleurs pour les routes API
│   ├── lib/            # Bibliothèques (db, schema, jwt, etc.)
│   ├── middleware/     # Middlewares Express
│   ├── routes/         # Définition des routes
│   ├── validations/    # Validations avec express-validator
│   └── db/             # Scripts de migration et seed
├── scripts/            # Scripts utilitaires
├── drizzle.config.mjs  # Configuration Drizzle
└── server.js           # Point d'entrée de l'application
```

## API Endpoints

- `GET /health` - Health check
- `GET /api` - Informations sur l'API
- `/api/auth/*` - Authentification
- `/api/users/*` - Gestion des utilisateurs
- `/api/dishes/*` - Gestion des plats
- `/api/orders/*` - Gestion des commandes
- `/api/reviews/*` - Gestion des avis
- `/api/notifications/*` - Notifications
- `/api/applications/*` - Candidatures

## Docker

Voir `DOCKER.md` à la racine du projet pour les instructions de déploiement avec Docker.
