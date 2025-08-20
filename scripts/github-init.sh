#!/bin/bash

# Script para inicializar repositório GitHub
# Script to initialize GitHub repository

echo "🚀 Inicializador GitHub / GitHub Initializer"
echo "============================================="

# Verificar se está no diretório correto
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Execute este script no diretório raiz do projeto"
    echo "❌ Run this script from the project root directory"
    exit 1
fi

# Verificar se Git está configurado
check_git_config() {
    echo "🔍 Verificando configuração Git / Checking Git config..."
    
    local user_name=$(git config --global user.name)
    local user_email=$(git config --global user.email)
    
    if [ -z "$user_name" ] || [ -z "$user_email" ]; then
        echo "❌ Git não está configurado. Configure primeiro:"
        echo "❌ Git is not configured. Configure first:"
        echo "   git config --global user.name 'Seu Nome'"
        echo "   git config --global user.email 'seu@email.com'"
        exit 1
    fi
    
    echo "✅ Git configurado para: $user_name ($user_email)"
}

# Verificar se GitHub CLI está instalado
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        echo "❌ GitHub CLI não encontrado. Instale primeiro:"
        echo "❌ GitHub CLI not found. Install first:"
        echo "   https://cli.github.com/"
        exit 1
    fi
    
    # Verificar se está autenticado
    if ! gh auth status &> /dev/null; then
        echo "❌ GitHub CLI não está autenticado. Execute:"
        echo "❌ GitHub CLI is not authenticated. Run:"
        echo "   gh auth login"
        exit 1
    fi
    
    echo "✅ GitHub CLI configurado"
}

# Preparar repositório
prepare_repository() {
    echo "📦 Preparando repositório / Preparing repository..."
    
    # Inicializar Git se necessário
    if [ ! -d ".git" ]; then
        git init
        echo "✅ Git inicializado / Git initialized"
    fi
    
    # Criar .gitignore se não existir
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/frontend/build
/backend/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
data/
*.db

# VirtualBox
*.vdi
*.vmdk
*.vbox
*.vbox-prev

# Temporary files
tmp/
temp/
EOF
        echo "✅ .gitignore criado / .gitignore created"
    fi
    
    # Adicionar arquivos
    git add .
    
    # Primeiro commit
    if ! git log --oneline &> /dev/null; then
        echo "💬 Fazendo primeiro commit bilíngue / Making first bilingual commit..."
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

📚 Documentação / Documentation:
- Guias de instalação em PT/EN
- API documentada completamente
- Scripts de automação incluídos
- Templates para contribuição

---

🎉 feat: Initial VirtualBox Manager project

✨ Complete VirtualBox management system implementation:

📋 Features:
- 🖥️ Complete VM management (create, start, stop, delete)
- 📸 Snapshot system (create, restore, list)
- 📜 Script execution on VMs
- 🌐 Modern React interface with Material-UI
- 🔐 Secure RESTful API with authentication
- 📊 Dashboard with real-time statistics

🛠️ Tech Stack:
- Backend: Node.js + Express + MongoDB
- Frontend: React.js + Material-UI + React Query
- VirtualBox: Integration via VBoxManage CLI
- DevOps: Docker + GitHub Actions
- Documentation: Bilingual (PT/EN)

📚 Documentation:
- Installation guides in PT/EN
- Completely documented API
- Automation scripts included
- Contribution templates"
        
        echo "✅ Primeiro commit realizado / First commit done"
    fi
}

# Criar repositório no GitHub
create_github_repo() {
    echo "🌐 Criando repositório no GitHub / Creating GitHub repository..."
    
    local repo_name="virtualbox-manager"
    local description="🖥️ Sistema completo de gerenciamento VirtualBox com Node.js + React | Complete VirtualBox management system with Node.js + React"
    
    # Verificar se repositório já existe
    if gh repo view "$repo_name" &> /dev/null; then
        echo "⚠️ Repositório já existe. Deseja continuar? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            echo "❌ Operação cancelada"
            exit 1
        fi
    else
        # Criar repositório
        gh repo create "$repo_name" \
            --description "$description" \
            --public \
            --add-readme=false \
            --clone=false
        
        echo "✅ Repositório criado no GitHub"
    fi
    
    # Adicionar remote
    if ! git remote get-url origin &> /dev/null; then
        local username=$(gh api user --jq .login)
        git remote add origin "https://github.com/$username/$repo_name.git"
        echo "✅ Remote origin adicionado"
    fi
    
    # Push inicial
    git branch -M main
    git push -u origin main
    
    echo "✅ Código enviado para GitHub"
}

# Configurar repositório
configure_repository() {
    echo "⚙️ Configurando repositório / Configuring repository..."
    
    # Definir topics
    gh repo edit \
        --add-topic "virtualbox" \
        --add-topic "nodejs" \
        --add-topic "react" \
        --add-topic "mongodb" \
        --add-topic "vm-management" \
        --add-topic "automation" \
        --add-topic "bilingual" \
        --add-topic "full-stack"
    
    # Habilitar GitHub Pages se houver documentação
    if [ -d "docs" ]; then
        echo "📄 Configurando GitHub Pages..."
        gh api repos/:owner/:repo/pages \
            --method POST \
            --field source='{"branch":"main","path":"/docs"}' \
            &> /dev/null || true
    fi
    
    echo "✅ Repositório configurado"
}

# Abrir repositório no browser
open_repository() {
    echo "🌐 Abrindo repositório no navegador / Opening repository in browser..."
    gh repo view --web
}

# Mostrar próximos passos
show_next_steps() {
    echo ""
    echo "🎉 Repositório GitHub criado com sucesso!"
    echo "🎉 GitHub repository created successfully!"
    echo ""
    echo "📋 Próximos passos / Next steps:"
    echo ""
    echo "1. 🔧 Configurar variáveis de ambiente / Set up environment variables:"
    echo "   cd backend && cp .env.example .env"
    echo ""
    echo "2. 🗄️ Configurar MongoDB / Set up MongoDB:"
    echo "   - Local: mongod"
    echo "   - Cloud: MongoDB Atlas"
    echo ""
    echo "3. 🚀 Iniciar desenvolvimento / Start development:"
    echo "   npm run dev"
    echo ""
    echo "4. 📚 Ler documentação / Read documentation:"
    echo "   docs/pt/QUICK_START.md (Português)"
    echo "   docs/en/QUICK_START.md (English)"
    echo ""
    echo "5. 🤝 Contribuir / Contribute:"
    echo "   ./scripts/bilingual-commit.sh (Linux/macOS)"
    echo "   .\\scripts\\bilingual-commit.bat (Windows)"
    echo ""
    echo "🔗 Links úteis / Useful links:"
    local username=$(gh api user --jq .login)
    echo "   📖 Repositório: https://github.com/$username/virtualbox-manager"
    echo "   📄 Documentação: https://$username.github.io/virtualbox-manager"
    echo "   🐛 Issues: https://github.com/$username/virtualbox-manager/issues"
    echo ""
}

# Menu principal
case "${1:-menu}" in
    "check"|"c")
        check_git_config
        check_gh_cli
        ;;
    "prepare"|"p")
        prepare_repository
        ;;
    "create"|"cr")
        create_github_repo
        ;;
    "configure"|"cf")
        configure_repository
        ;;
    "open"|"o")
        open_repository
        ;;
    "all"|"a")
        echo "🚀 Executando setup completo / Running complete setup..."
        check_git_config
        check_gh_cli
        prepare_repository
        create_github_repo
        configure_repository
        show_next_steps
        ;;
    "menu"|"m"|"")
        echo ""
        echo "📋 Opções disponíveis / Available options:"
        echo ""
        echo "  $0 check      - Verificar configurações / Check configurations"
        echo "  $0 prepare    - Preparar repositório local / Prepare local repository"
        echo "  $0 create     - Criar no GitHub / Create on GitHub"
        echo "  $0 configure  - Configurar repositório / Configure repository"
        echo "  $0 open       - Abrir no navegador / Open in browser"
        echo "  $0 all        - Executar tudo / Run everything"
        echo ""
        echo "🔗 Aliases: c=check, p=prepare, cr=create, cf=configure, o=open, a=all"
        echo ""
        echo "💡 Uso recomendado / Recommended usage:"
        echo "   $0 all"
        echo ""
        ;;
    *)
        echo "❌ Comando desconhecido: $1"
        echo "❌ Unknown command: $1"
        echo "Use '$0 menu' para ver opções"
        exit 1
        ;;
esac
