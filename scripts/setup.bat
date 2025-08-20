@echo off
:: VirtualBox Manager - Setup Script para Windows
:: Este script configura o ambiente de desenvolvimento no Windows

echo 🚀 Configurando VirtualBox Manager...

:: Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Por favor, instale Node.js 18+
    pause
    exit /b 1
)

:: Verificar se MongoDB está instalado
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB não encontrado. Verifique se está instalado e configurado.
)

:: Verificar se VirtualBox está instalado
VBoxManage --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  VirtualBox não encontrado. Verifique se está instalado e no PATH.
)

echo 📦 Instalando dependências do backend...
cd backend
call npm install

echo 📦 Instalando dependências do frontend...
cd ..\frontend
call npm install

echo ⚙️  Configurando ambiente...
cd ..\backend
if not exist .env (
    copy .env.example .env
    echo ✅ Arquivo .env criado. Configure suas variáveis de ambiente.
)

:: Criar diretórios necessários
if not exist logs mkdir logs
if not exist temp mkdir temp

echo ✅ Setup concluído!
echo.
echo 📋 Próximos passos:
echo 1. Configure as variáveis no arquivo backend\.env
echo 2. Inicie o MongoDB
echo 3. Execute 'npm run dev' no diretório backend
echo 4. Execute 'npm start' no diretório frontend
echo.
echo 🌐 Acesse: http://localhost:3000
pause
