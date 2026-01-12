#!/bin/sh
set -e

echo "🔄 Application des migrations Drizzle..."
node src/db/migrate.js

echo "🚀 Démarrage du serveur..."
exec node server.js

