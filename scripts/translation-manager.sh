#!/bin/bash

# Script para gerenciar traduções e manter sincronização PT/EN
# Script to manage translations and maintain PT/EN sync

echo "🌐 Gerenciador de Traduções / Translation Manager"
echo "================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar sincronização
check_sync() {
    echo -e "${BLUE}🔍 Verificando sincronização / Checking sync...${NC}"
    
    local pt_files=(
        "docs/pt/API.md"
        "docs/pt/QUICK_START.md"
        "docs/pt/CONTRIBUTING.md"
    )
    
    local en_files=(
        "docs/en/API.md"
        "docs/en/QUICK_START.md"
        "docs/en/CONTRIBUTING.md"
    )
    
    local issues=0
    
    for i in "${!pt_files[@]}"; do
        local pt_file="${pt_files[$i]}"
        local en_file="${en_files[$i]}"
        
        if [ -f "$pt_file" ] && [ -f "$en_file" ]; then
            local pt_lines=$(wc -l < "$pt_file")
            local en_lines=$(wc -l < "$en_file")
            local diff=$((pt_lines - en_lines))
            
            if [ ${diff#-} -gt 10 ]; then  # Diferença maior que 10 linhas
                echo -e "${YELLOW}⚠️  Diferença significativa detectada:${NC}"
                echo "   PT: $pt_file ($pt_lines linhas)"
                echo "   EN: $en_file ($en_lines linhas)"
                echo "   Diferença: $diff linhas"
                ((issues++))
            else
                echo -e "${GREEN}✅ ${pt_file##*/} - Sincronizado${NC}"
            fi
        elif [ ! -f "$pt_file" ]; then
            echo -e "${RED}❌ Arquivo PT faltando: $pt_file${NC}"
            ((issues++))
        elif [ ! -f "$en_file" ]; then
            echo -e "${RED}❌ Arquivo EN faltando: $en_file${NC}"
            ((issues++))
        fi
    done
    
    if [ $issues -eq 0 ]; then
        echo -e "${GREEN}🎉 Todos os arquivos estão sincronizados!${NC}"
        echo -e "${GREEN}🎉 All files are synchronized!${NC}"
    else
        echo -e "${YELLOW}⚠️  $issues problema(s) encontrado(s)${NC}"
        echo -e "${YELLOW}⚠️  $issues issue(s) found${NC}"
    fi
    
    return $issues
}

# Função para criar template de tradução
create_translation_template() {
    local file_type="$1"
    local template_file="docs/templates/${file_type}_TEMPLATE.md"
    
    mkdir -p "docs/templates"
    
    case $file_type in
        "API")
            cat > "$template_file" << 'EOF'
# 📖 API Documentation Template

## Seções Principais / Main Sections

### Autenticação / Authentication
- [ ] Endpoints de auth
- [ ] Tokens JWT
- [ ] Middlewares

### VMs (Virtual Machines)
- [ ] Listar VMs / List VMs
- [ ] Criar VM / Create VM
- [ ] Controlar VM / Control VM
- [ ] Deletar VM / Delete VM

### Snapshots
- [ ] Criar snapshot / Create snapshot
- [ ] Restaurar snapshot / Restore snapshot
- [ ] Listar snapshots / List snapshots
- [ ] Deletar snapshot / Delete snapshot

### Scripts
- [ ] Executar script / Execute script
- [ ] Upload de arquivo / File upload
- [ ] Histórico / History

## Checklist de Tradução / Translation Checklist
- [ ] Todos os endpoints documentados / All endpoints documented
- [ ] Exemplos de request/response / Request/response examples
- [ ] Códigos de erro / Error codes
- [ ] Autenticação explicada / Authentication explained
EOF
            ;;
        "QUICK_START")
            cat > "$template_file" << 'EOF'
# 🚀 Quick Start Template

## Seções Obrigatórias / Required Sections

### Pré-requisitos / Prerequisites
- [ ] Node.js versão / version
- [ ] MongoDB
- [ ] VirtualBox
- [ ] Git

### Instalação / Installation
- [ ] Clone do repositório / Repository clone
- [ ] Instalação de dependências / Dependencies installation
- [ ] Configuração do ambiente / Environment setup
- [ ] Banco de dados / Database setup

### Execução / Running
- [ ] Comandos para iniciar / Start commands
- [ ] URLs de acesso / Access URLs
- [ ] Verificação de funcionamento / Functionality check

### Primeiros Passos / First Steps
- [ ] Login/cadastro / Login/register
- [ ] Criação de VM / VM creation
- [ ] Teste básico / Basic test

## Checklist de Tradução / Translation Checklist
- [ ] Comandos traduzidos / Commands translated
- [ ] URLs atualizadas / URLs updated
- [ ] Screenshots localizados / Localized screenshots
EOF
            ;;
    esac
    
    echo -e "${GREEN}✅ Template criado: $template_file${NC}"
}

# Função para validar estrutura de arquivo
validate_file_structure() {
    local file="$1"
    local lang="$2"
    
    echo -e "${BLUE}🔍 Validando estrutura: $file${NC}"
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Arquivo não encontrado: $file${NC}"
        return 1
    fi
    
    # Verificar se tem cabeçalho
    if ! head -n 5 "$file" | grep -q "^#"; then
        echo -e "${YELLOW}⚠️  Sem cabeçalho H1 detectado${NC}"
    fi
    
    # Verificar se tem seções
    local sections=$(grep -c "^##" "$file")
    if [ "$sections" -lt 3 ]; then
        echo -e "${YELLOW}⚠️  Poucas seções detectadas ($sections)${NC}"
    fi
    
    # Verificar idioma específico
    case $lang in
        "pt")
            if ! grep -qi "português\|instalação\|configuração" "$file"; then
                echo -e "${YELLOW}⚠️  Conteúdo pode não estar em português${NC}"
            fi
            ;;
        "en")
            if ! grep -qi "english\|installation\|configuration" "$file"; then
                echo -e "${YELLOW}⚠️  Content may not be in English${NC}"
            fi
            ;;
    esac
    
    echo -e "${GREEN}✅ Validação concluída${NC}"
}

# Função para gerar relatório de tradução
generate_translation_report() {
    local report_file="docs/TRANSLATION_REPORT.md"
    
    echo "# 📊 Relatório de Tradução / Translation Report" > "$report_file"
    echo "" >> "$report_file"
    echo "Gerado em / Generated on: $(date)" >> "$report_file"
    echo "" >> "$report_file"
    
    echo "## 📈 Status dos Arquivos / File Status" >> "$report_file"
    echo "" >> "$report_file"
    
    local files=(
        "API.md"
        "QUICK_START.md"
        "CONTRIBUTING.md"
    )
    
    echo "| Arquivo / File | PT | EN | Sincronizado / Synced |" >> "$report_file"
    echo "|---|---|---|---|" >> "$report_file"
    
    for file in "${files[@]}"; do
        local pt_exists="❌"
        local en_exists="❌"
        local synced="❌"
        
        if [ -f "docs/pt/$file" ]; then
            pt_exists="✅"
        fi
        
        if [ -f "docs/en/$file" ]; then
            en_exists="✅"
        fi
        
        if [ -f "docs/pt/$file" ] && [ -f "docs/en/$file" ]; then
            local pt_lines=$(wc -l < "docs/pt/$file")
            local en_lines=$(wc -l < "docs/en/$file")
            local diff=$((pt_lines - en_lines))
            
            if [ ${diff#-} -le 10 ]; then
                synced="✅"
            else
                synced="⚠️ ($diff)"
            fi
        fi
        
        echo "| $file | $pt_exists | $en_exists | $synced |" >> "$report_file"
    done
    
    echo "" >> "$report_file"
    echo "## 🎯 Próximos Passos / Next Steps" >> "$report_file"
    echo "" >> "$report_file"
    echo "- [ ] Revisar arquivos com grande diferença de linhas" >> "$report_file"
    echo "- [ ] Review files with large line differences" >> "$report_file"
    echo "- [ ] Atualizar templates de tradução" >> "$report_file"
    echo "- [ ] Update translation templates" >> "$report_file"
    
    echo -e "${GREEN}✅ Relatório gerado: $report_file${NC}"
}

# Menu principal
case "$1" in
    "check"|"c")
        check_sync
        ;;
    "template"|"t")
        echo "Criar template para (API/QUICK_START):"
        read -p "Tipo: " type
        create_translation_template "$type"
        ;;
    "validate"|"v")
        echo "Validar arquivo:"
        echo "1. docs/pt/API.md"
        echo "2. docs/en/API.md"
        echo "3. docs/pt/QUICK_START.md"
        echo "4. docs/en/QUICK_START.md"
        read -p "Escolha (1-4): " choice
        
        case $choice in
            1) validate_file_structure "docs/pt/API.md" "pt" ;;
            2) validate_file_structure "docs/en/API.md" "en" ;;
            3) validate_file_structure "docs/pt/QUICK_START.md" "pt" ;;
            4) validate_file_structure "docs/en/QUICK_START.md" "en" ;;
            *) echo "Opção inválida" ;;
        esac
        ;;
    "report"|"r")
        generate_translation_report
        ;;
    "help"|"h"|"")
        echo "🌐 Uso / Usage:"
        echo ""
        echo "  $0 check      - Verificar sincronização / Check sync"
        echo "  $0 template   - Criar template / Create template"
        echo "  $0 validate   - Validar arquivo / Validate file"
        echo "  $0 report     - Gerar relatório / Generate report"
        echo "  $0 help       - Mostrar ajuda / Show help"
        echo ""
        echo "🔗 Aliases:"
        echo "  c = check, t = template, v = validate, r = report, h = help"
        ;;
    *)
        echo -e "${RED}❌ Comando desconhecido: $1${NC}"
        echo "Use '$0 help' para ver opções disponíveis"
        exit 1
        ;;
esac
