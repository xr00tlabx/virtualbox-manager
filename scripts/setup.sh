#!/bin/bash

# VirtualBox Manager - Setup Script
# Este script configura o ambiente de desenvolvimento

set -e

echo "🚀 Configurando VirtualBox Manager..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+"
    exit 1
fi

# Verificar se MongoDB está instalado
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB não encontrado. Verifique se está instalado e configurado."
fi

# Verificar se VirtualBox está instalado
if ! command -v VBoxManage &> /dev/null; then
    echo "⚠️  VirtualBox não encontrado. Verifique se está instalado e no PATH."
fi

echo "📦 Instalando dependências do backend..."
cd backend
npm install

echo "📦 Instalando dependências do frontend..."
cd ../frontend
npm install

echo "⚙️  Configurando ambiente..."
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Arquivo .env criado. Configure suas variáveis de ambiente."
fi

# Criar diretórios necessários
mkdir -p logs temp

echo "✅ Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis no arquivo backend/.env"
echo "2. Inicie o MongoDB"
echo "3. Execute 'npm run dev' no diretório backend"
echo "4. Execute 'npm start' no diretório frontend"
echo ""
echo "🌐 Acesse: http://localhost:3000"
