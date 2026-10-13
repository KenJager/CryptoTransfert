#!/bin/bash
set -e  # Arrête le script à la première erreur

# Configuration
APP_NAME="swifto"
APP_DIR="/home/ken/www/CryptoTransfert"
BRANCH="main"

echo "🚀 Déploiement de $APP_NAME..."

# 1. Aller dans le dossier
cd "$APP_DIR"

# 2. Pull les dernières modifs
echo "📥 Pull des dernières modifications..."
git pull origin "$BRANCH"

# 3. Installer les dépendances
echo "📦 Installation des dépendances..."
pnpm install --frozen-lockfile

# 4. Build
echo "🔨 Build de l'application..."
pnpm run build

# 5. Redémarrer PM2
echo "🔄 Redémarrage de PM2..."
pm2 restart "$APP_NAME" || pm2 start pnpm --name "$APP_NAME" -- start

# 6. Sauvegarder la config PM2
pm2 save

echo "✅ Déploiement terminé avec succès !"
