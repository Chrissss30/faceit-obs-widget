#!/bin/bash
# Script para setup local rápido

echo "🎮 FACEIT OBS Widget - Setup Local"
echo "=================================="

# Backend
echo ""
echo "📦 Instalando Backend..."
cd server
npm install
echo "✅ Backend instalado!"

# Frontend
echo ""
echo "📦 Instalando Frontend..."
cd ../client
npm install
echo "✅ Frontend instalado!"

echo ""
echo "🚀 Para rodar:"
echo "   Terminal 1: cd server && npm start"
echo "   Terminal 2: cd client && npm run dev"
echo ""
echo "Acesse: http://localhost:3000"
