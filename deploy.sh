#!/bin/bash
set -euo pipefail

# Configuration
APP_NAME="swifto"
APP_DIR="/home/ken/www/CryptoTransfert"
PROJECT_DIR="$APP_DIR/swifto"
BRANCH="main"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "🚀 Déploiement de $APP_NAME"

# 1. Aller dans le dossier racine du repo
cd "$APP_DIR" || { log "❌ Dossier introuvable : $APP_DIR"; exit 1; }

# 2. Pull les dernières modifs
log "📥 Pull des dernières modifications..."
git fetch origin
git reset --hard "origin/$BRANCH"

# 3. Aller dans le dossier du projet Next.js
cd "$PROJECT_DIR" || { log "❌ Dossier introuvable : $PROJECT_DIR"; exit 1; }

# Vérifier que package.json existe
if [ ! -f "package.json" ]; then
  log "❌ package.json introuvable dans $PROJECT_DIR"
  exit 1
fi

# 4. Installer les dépendances
log "📦 Installation des dépendances..."
pnpm install --frozen-lockfile

# 5. Build
log "🔨 Build de l'application..."
pnpm run build

# 6. Redémarrer PM2
log "🔄 Redémarrage de PM2..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start pnpm --name "$APP_NAME" -- start
fi

pm2 save

log "✅ Déploiement terminé avec succès !"
