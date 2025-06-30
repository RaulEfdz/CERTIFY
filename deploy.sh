#!/usr/bin/env bash
set -euo pipefail

# ——— Configuración previa ———
# Asegúrate de tener VERCEL_TOKEN en tu entorno o haber hecho 'vercel login'
if ! command -v vercel &> /dev/null; then
  echo "🔧 Vercel CLI no encontrado. Instalando globalmente..."
  npm install -g vercel
fi

echo "🔐 Autenticación en Vercel..."
if [ -n "${VERCEL_TOKEN-}" ]; then
  echo "  Usando VERCEL_TOKEN."
else
  vercel login
fi

# ——— Variables de entorno ———
echo "🌱 Obteniendo variables de entorno de Vercel..."
vercel env pull .env.local --yes

# ——— Dependencias ———
echo "📦 Instalando dependencias..."
npm ci

# ——— Linting ———
echo "🔍 Ejecutando lint..."
npm run lint

# ——— Type-check ———
echo "📝 Verificando tipos (TypeScript)..."
npm run type-check

# ——— Tests ———
echo "🧪 Ejecutando tests..."
npm test

# ——— Build ———
echo "🏗️ Construyendo la aplicación..."
npm run build

# ——— Deploy ———
echo "🚀 Desplegando en Vercel (producción)..."
vercel --prod --confirm

echo "✅ Despliegue completado."
