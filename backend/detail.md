# Structure détaillée du backend

Cette documentation liste la structure des dossiers et fichiers du backend, avec une brève description de chaque élément.

## Arborescence

- backend/

  - server.js — Point d'entrée du serveur Express, configuration CORS, routes et socket init.
  - package.json — Dépendances et scripts du backend.
  - package-lock.json
  - .env.example — Variables d'environnement d'exemple.
  - README.md — Documentation du backend (existante).
  - scripts/
    - demo-ethereal.js — Script d'exemple pour tester l'envoi d'emails via Ethereal.
    - socket-notif-test.js — Script pour tester les notifications socket.
    - test-email.js — Script utilitaire pour tester l'envoi d'emails.
  - prisma/

    - schema.prisma — Schéma Prisma (modèles de la base de données).
    - seed.js — Script de seed de la base de données.
    - "seed copy.js" — Copie du script seed (historique).
    - migrations/
      - migration_lock.toml
      - 20251229170209_init_seed/migration.sql
      - 20251229172840_remove_chef_role/migration.sql
      - 20251229190447_remove_badges/migration.sql
      - 20251229190950_remove_points/migration.sql
      - 20260104185046_add_notifications_model/migration.sql
      - 20260104224058_add_email_confirmation_to_user/migration.sql
      - 20260105095301_add_order_delivery/migration.sql

  - src/

    - controllers/

      - auth.controller.js — Logique pour l'authentification (login, register, me, email confirmation, etc.).
      - dish.controller.js — CRUD pour les plats (dishes).
      - notification.controller.js — Envoi et gestion des notifications.
      - order.controller.js — Gestion des commandes (création, mise à jour, liste).
      - review.controller.js — Gestion des avis/notes.
      - user.controller.js — Gestion des utilisateurs (profil, mise à jour, suppression, etc.).

    - routes/

      - index.js — Regroupe et expose toutes les routes : `/auth`, `/users`, `/dishes`, `/reviews`, `/orders`, `/notifications`.
      - auth.routes.js — Routes publiques et protégées liées à l'auth (login/register/confirm/etc.).
      - dish.routes.js — Routes CRUD public/protégé pour les plats.
      - notification.routes.js — Routes pour notifications.
      - order.routes.js — Routes pour la gestion des commandes.
      - review.routes.js — Routes pour les reviews.
      - user.routes.js — Routes pour la gestion des utilisateurs.

    - middleware/

      - auth.middleware.js — Middleware d'authentification et d'autorisation (vérifie JWT, rôles).
      - error.middleware.js — Gestionnaire d'erreurs centralisé et middleware `notFound`.
      - upload.middleware.js — Middleware pour la gestion des uploads (Multer, Cloudinary integration).
      - validation.middleware.js — Middleware pour valider les requêtes (utilise les schémas de validations).

    - validations/

      - auth.validation.js — Schémas de validation pour l'auth (login, register, confirm).
      - dish.validation.js — Schémas pour la création/mise à jour/listing des plats.
      - order.validation.js — Schémas pour les commandes.
      - review.validation.js — Schémas pour les avis.
      - user.validation.js — Schémas pour le user (update, etc.).

    - lib/
      - bcrypt.js — Wrapper/utilitaires pour le hachage des mots de passe.
      - cloudinary.js — Configuration et helpers pour l'envoi d'images sur Cloudinary.
      - jwt.js — Helpers pour créer/valider JWTs.
      - mailer.js — Wrapper pour l'envoi d'emails (Nodemailer, templates, etc.).
      - prisma.js — Instance Prisma Client exportée.
      - socket.js — Initialisation de Socket.io et helpers pour notifications en temps réel.

## Description détaillée (par fichier)

- `server.js` — Initialise Express, charge les variables d'environnement, configure CORS selon `FRONTEND_URL`, ajoute le parsing JSON/urlencoded, définit des endpoints de health check, attache les routes via `src/routes/index.js`, initialise Socket.io via `src/lib/socket.js`, et démarre le serveur HTTP.

- `package.json` — Contient les scripts de démarrage (dev, start), dépendances (Express, Prisma, JWT, Nodemailer, Cloudinary, Multer, etc.).

- `prisma/schema.prisma` — Définit les modèles (User, Dish, Order, Review, Notification, etc.) et leurs relations, types et contraintes.

- `src/controllers/*.js` — Chaque contrôleur expose les fonctions nécessaires aux routes :

  - `auth.controller.js` : `login`, `register`, `logout`, `me`, `confirmEmail`, `forgotPassword`, `resetPassword` (selon l'implémentation).
  - `dish.controller.js` : `getDishes`, `getDish`, `createDish`, `updateDish`, `deleteDish`.
  - `order.controller.js` : `createOrder`, `getOrders`, `getOrder`, `updateOrder`, etc.
  - `review.controller.js` : `createReview`, `getReviews`, `deleteReview`.
  - `notification.controller.js` : `getNotifications`, `createNotification`, `markRead`.
  - `user.controller.js` : `getUsers`, `getUser`, `updateUser`, `deleteUser`.

- `src/routes/*.js` — Definit les routes Express et attache les middlewares d'auth/validation/upload au besoin.

- `src/middleware/auth.middleware.js` — Vérifie le JWT présent dans les cookies ou headers, ajoute `req.user`, et propose `authorize(...roles)` pour restreindre l'accès selon rôle (`ADMIN`, `SUPER_ADMIN`, etc.).

- `src/middleware/upload.middleware.js` — Utilise Multer pour gérer `multipart/form-data`, puis envoie l'image sur Cloudinary via `src/lib/cloudinary.js`.

- `src/middleware/validation.middleware.js` — Valide `req.body`/`req.query`/`req.params` selon le schéma passé depuis `src/validations/*`.

- `src/lib/prisma.js` — Initialise et exporte `new PrismaClient()` pour réutilisation.

- `src/lib/socket.js` — Fournit `initSocket(server)` pour attacher Socket.io à l'HTTP server et helpers pour émettre des notifications (`io.emit`, `socket.to(room).emit`, etc.).

- `src/lib/mailer.js` — Configure Nodemailer (SMTP, Ethereal ou service réel), fonctions utilitaires `sendEmail({ to, subject, html, text })`.

- `scripts/` — Scripts d'utilitaires pour dev et test (emails, sockets, seed data). `seed.js` peuple la DB via Prisma Client.

## Suggestions d'améliorations / points d'attention

- Séparer les services métiers des controllers (ex : `src/services/*.js`) pour une meilleure testabilité.
- Ajouter des tests unitaires et d'intégration (Jest, supertest) pour les routes critiques.
- Mettre en place une stratégie de logging (Winston ou pino) et gestion d'erreurs structurée.
- Protéger les endpoints sensibles et ajouter rate-limiting/CSRF si nécessaire.

---

Fichier généré automatiquement : `backend/detail.md` — modifie-le si tu veux plus de détails (ex. signature des fonctions, exemples de payloads, schéma Prisma détaillé, ou diagramme ERD).
