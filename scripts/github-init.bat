@echo off
chcp 65001 >nul

REM Script para inicializar repositório GitHub
REM Script to initialize GitHub repository

echo 🚀 Inicializador GitHub / GitHub Initializer
echo =============================================

REM Verificar se está no diretório correto
if not exist "package.json" (
    echo ❌ Execute este script no diretório raiz do projeto
    echo ❌ Run this script from the project root directory
    exit /b 1
)

if not exist "backend" (
    echo ❌ Diretório backend não encontrado
    echo ❌ Backend directory not found
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Diretório frontend não encontrado
    echo ❌ Frontend directory not found
    exit /b 1
)

if "%1"=="check" goto :check_config
if "%1"=="c" goto :check_config
if "%1"=="prepare" goto :prepare_repo
if "%1"=="p" goto :prepare_repo
if "%1"=="create" goto :create_repo
if "%1"=="cr" goto :create_repo
if "%1"=="configure" goto :configure_repo
if "%1"=="cf" goto :configure_repo
if "%1"=="open" goto :open_repo
if "%1"=="o" goto :open_repo
if "%1"=="all" goto :run_all
if "%1"=="a" goto :run_all
if "%1"=="menu" goto :show_menu
if "%1"=="m" goto :show_menu
if "%1"=="" goto :show_menu

echo ❌ Comando desconhecido: %1
echo ❌ Unknown command: %1
echo Use '%~nx0 menu' para ver opções
exit /b 1

:check_config
echo 🔍 Verificando configuração Git / Checking Git config...

REM Verificar Git
git config --global user.name >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não está configurado. Configure primeiro:
    echo ❌ Git is not configured. Configure first:
    echo    git config --global user.name "Seu Nome"
    echo    git config --global user.email "seu@email.com"
    exit /b 1
)

for /f "delims=" %%i in ('git config --global user.name') do set user_name=%%i
for /f "delims=" %%i in ('git config --global user.email') do set user_email=%%i

echo ✅ Git configurado para: %user_name% (%user_email%)

REM Verificar GitHub CLI
gh --version >nul 2>&1
if errorlevel 1 (
    echo ❌ GitHub CLI não encontrado. Instale primeiro:
    echo ❌ GitHub CLI not found. Install first:
    echo    https://cli.github.com/
    exit /b 1
)

REM Verificar autenticação
gh auth status >nul 2>&1
if errorlevel 1 (
    echo ❌ GitHub CLI não está autenticado. Execute:
    echo ❌ GitHub CLI is not authenticated. Run:
    echo    gh auth login
    exit /b 1
)

echo ✅ GitHub CLI configurado
goto :end

:prepare_repo
echo 📦 Preparando repositório / Preparing repository...

REM Inicializar Git se necessário
if not exist ".git" (
    git init
    echo ✅ Git inicializado / Git initialized
)

REM Criar .gitignore se não existir
if not exist ".gitignore" (
    echo # Dependencies > .gitignore
    echo node_modules/ >> .gitignore
    echo npm-debug.log* >> .gitignore
    echo yarn-debug.log* >> .gitignore
    echo yarn-error.log* >> .gitignore
    echo. >> .gitignore
    echo # Production builds >> .gitignore
    echo /frontend/build >> .gitignore
    echo /backend/dist >> .gitignore
    echo. >> .gitignore
    echo # Environment variables >> .gitignore
    echo .env >> .gitignore
    echo .env.local >> .gitignore
    echo .env.development.local >> .gitignore
    echo .env.test.local >> .gitignore
    echo .env.production.local >> .gitignore
    echo. >> .gitignore
    echo # Logs >> .gitignore
    echo logs >> .gitignore
    echo *.log >> .gitignore
    echo. >> .gitignore
    echo # IDEs >> .gitignore
    echo .vscode/ >> .gitignore
    echo .idea/ >> .gitignore
    echo *.swp >> .gitignore
    echo *.swo >> .gitignore
    echo. >> .gitignore
    echo # OS >> .gitignore
    echo .DS_Store >> .gitignore
    echo Thumbs.db >> .gitignore
    echo. >> .gitignore
    echo # VirtualBox >> .gitignore
    echo *.vdi >> .gitignore
    echo *.vmdk >> .gitignore
    echo *.vbox >> .gitignore
    echo *.vbox-prev >> .gitignore
    
    echo ✅ .gitignore criado / .gitignore created
)

REM Adicionar arquivos
git add .

REM Primeiro commit
git log --oneline >nul 2>&1
if errorlevel 1 (
    echo 💬 Fazendo primeiro commit bilíngue / Making first bilingual commit...
    git commit -m "🎉 feat: Projeto VirtualBox Manager inicial

✨ Implementação completa do sistema de gerenciamento VirtualBox:

📋 Funcionalidades / Features:
- 🖥️ Gerenciamento completo de VMs (criar, iniciar, parar, excluir)
- 📸 Sistema de snapshots (criar, restaurar, listar)
- 📜 Execução de scripts em VMs
- 🌐 Interface React moderna com Material-UI
- 🔐 API RESTful segura com autenticação
- 📊 Dashboard com estatísticas em tempo real

🛠️ Stack Tecnológica / Tech Stack:
- Backend: Node.js + Express + MongoDB
- Frontend: React.js + Material-UI + React Query
- VirtualBox: Integração via VBoxManage CLI
- DevOps: Docker + GitHub Actions
- Documentação: Bilíngue (PT/EN)

---

🎉 feat: Initial VirtualBox Manager project

✨ Complete VirtualBox management system implementation"
    
    echo ✅ Primeiro commit realizado / First commit done
)
goto :end

:create_repo
echo 🌐 Criando repositório no GitHub / Creating GitHub repository...

set repo_name=virtualbox-manager
set description=🖥️ Sistema completo de gerenciamento VirtualBox com Node.js + React ^| Complete VirtualBox management system with Node.js + React

REM Verificar se repositório já existe
gh repo view %repo_name% >nul 2>&1
if not errorlevel 1 (
    echo ⚠️ Repositório já existe. Deseja continuar? (y/N)
    set /p response=
    if /i not "%response%"=="y" (
        echo ❌ Operação cancelada
        exit /b 1
    )
) else (
    REM Criar repositório
    gh repo create %repo_name% --description "%description%" --public --add-readme=false --clone=false
    echo ✅ Repositório criado no GitHub
)

REM Adicionar remote
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    for /f "delims=" %%i in ('gh api user --jq .login') do set username=%%i
    git remote add origin https://github.com/!username!/%repo_name%.git
    echo ✅ Remote origin adicionado
)

REM Push inicial
git branch -M main
git push -u origin main

echo ✅ Código enviado para GitHub
goto :end

:configure_repo
echo ⚙️ Configurando repositório / Configuring repository...

REM Definir topics
gh repo edit --add-topic virtualbox --add-topic nodejs --add-topic react --add-topic mongodb --add-topic vm-management --add-topic automation --add-topic bilingual --add-topic full-stack

echo ✅ Repositório configurado
goto :end

:open_repo
echo 🌐 Abrindo repositório no navegador / Opening repository in browser...
gh repo view --web
goto :end

:run_all
echo 🚀 Executando setup completo / Running complete setup...
call :check_config
if errorlevel 1 exit /b 1
call :prepare_repo
if errorlevel 1 exit /b 1
call :create_repo
if errorlevel 1 exit /b 1
call :configure_repo
if errorlevel 1 exit /b 1
call :show_next_steps
goto :end

:show_next_steps
echo.
echo 🎉 Repositório GitHub criado com sucesso!
echo 🎉 GitHub repository created successfully!
echo.
echo 📋 Próximos passos / Next steps:
echo.
echo 1. 🔧 Configurar variáveis de ambiente / Set up environment variables:
echo    cd backend ^&^& copy .env.example .env
echo.
echo 2. 🗄️ Configurar MongoDB / Set up MongoDB:
echo    - Local: mongod
echo    - Cloud: MongoDB Atlas
echo.
echo 3. 🚀 Iniciar desenvolvimento / Start development:
echo    npm run dev
echo.
echo 4. 📚 Ler documentação / Read documentation:
echo    docs\pt\QUICK_START.md (Português)
echo    docs\en\QUICK_START.md (English)
echo.
echo 5. 🤝 Contribuir / Contribute:
echo    .\scripts\bilingual-commit.bat (Windows)
echo.
goto :end

:show_menu
echo.
echo 📋 Opções disponíveis / Available options:
echo.
echo   %~nx0 check      - Verificar configurações / Check configurations
echo   %~nx0 prepare    - Preparar repositório local / Prepare local repository
echo   %~nx0 create     - Criar no GitHub / Create on GitHub
echo   %~nx0 configure  - Configurar repositório / Configure repository
echo   %~nx0 open       - Abrir no navegador / Open in browser
echo   %~nx0 all        - Executar tudo / Run everything
echo.
echo 🔗 Aliases: c=check, p=prepare, cr=create, cf=configure, o=open, a=all
echo.
echo 💡 Uso recomendado / Recommended usage:
echo    %~nx0 all
echo.
goto :end

:end
exit /b 0
