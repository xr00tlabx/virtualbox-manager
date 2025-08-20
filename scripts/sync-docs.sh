#!/bin/bash

# Script para sincronizar documentação PT/EN
# Script to sync PT/EN documentation

echo "📚 Sincronização de Documentação / Documentation Sync"
echo "====================================================="

# Criar índice de documentação bilíngue
create_index() {
    cat > docs/README.md << 'EOF'
# 📚 Documentação / Documentation

## 🇧🇷 Português

- [🚀 Guia de Instalação Rápida](pt/QUICK_START.md)
- [📖 Documentação da API](pt/API.md)
- [🤝 Como Contribuir](pt/CONTRIBUTING.md)

## 🇺🇸 English

- [🚀 Quick Start Guide](en/QUICK_START.md)
- [📖 API Documentation](en/API.md)
- [🤝 Contributing](en/CONTRIBUTING.md)

## 🌐 Configuração de Idiomas / Language Configuration

- [📝 Guia de Idiomas / Language Guide](LANGUAGE_GUIDE.md)

---

**Escolha seu idioma / Choose your language:** [PT](pt/) | [EN](en/)
EOF
}

# Verificar se arquivos existem
check_files() {
    local missing=0
    
    if [ ! -f "docs/pt/API.md" ]; then
        echo "❌ Faltando: docs/pt/API.md"
        missing=1
    fi
    
    if [ ! -f "docs/en/API.md" ]; then
        echo "❌ Faltando: docs/en/API.md"
        missing=1
    fi
    
    if [ ! -f "docs/pt/QUICK_START.md" ]; then
        echo "❌ Faltando: docs/pt/QUICK_START.md"
        missing=1
    fi
    
    if [ ! -f "docs/en/QUICK_START.md" ]; then
        echo "❌ Faltando: docs/en/QUICK_START.md"
        missing=1
    fi
    
    if [ $missing -eq 0 ]; then
        echo "✅ Todos os arquivos encontrados / All files found"
    fi
    
    return $missing
}

# Gerar template de contribuição
create_contributing() {
    # Português
    cat > docs/pt/CONTRIBUTING.md << 'EOF'
# 🤝 Como Contribuir

Obrigado por seu interesse em contribuir com o VirtualBox Manager!

## 📋 Processo de Contribuição

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie** uma branch para sua feature: `git checkout -b minha-feature`
4. **Faça** suas mudanças
5. **Teste** suas mudanças
6. **Commit** usando nosso formato bilíngue
7. **Push** para sua branch: `git push origin minha-feature`
8. **Abra** um Pull Request

## 💬 Commits Bilíngues

Use o script para commits em PT/EN:
```bash
./scripts/bilingual-commit.sh  # Linux/macOS
.\scripts\bilingual-commit.bat # Windows
```

## 🐛 Reportando Bugs

Use nosso template de bug report no GitHub Issues.

## ✨ Sugerindo Funcionalidades

Use nosso template de feature request no GitHub Issues.

## 📝 Padrões de Código

- Use ESLint e Prettier
- Siga as convenções existentes
- Adicione testes quando aplicável
- Documente mudanças importantes

## 🌐 Documentação

- Mantenha docs em PT e EN sincronizadas
- Use emojis para melhor legibilidade
- Inclua exemplos práticos

---

**Obrigado por contribuir! 🎉**
EOF

    # English
    cat > docs/en/CONTRIBUTING.md << 'EOF'
# 🤝 Contributing

Thank you for your interest in contributing to VirtualBox Manager!

## 📋 Contributing Process

1. **Fork** the repository
2. **Clone** your fork
3. **Create** a branch for your feature: `git checkout -b my-feature`
4. **Make** your changes
5. **Test** your changes
6. **Commit** using our bilingual format
7. **Push** to your branch: `git push origin my-feature`
8. **Open** a Pull Request

## 💬 Bilingual Commits

Use the script for PT/EN commits:
```bash
./scripts/bilingual-commit.sh  # Linux/macOS
.\scripts\bilingual-commit.bat # Windows
```

## 🐛 Reporting Bugs

Use our bug report template in GitHub Issues.

## ✨ Suggesting Features

Use our feature request template in GitHub Issues.

## 📝 Code Standards

- Use ESLint and Prettier
- Follow existing conventions
- Add tests when applicable
- Document important changes

## 🌐 Documentation

- Keep PT and EN docs synchronized
- Use emojis for better readability
- Include practical examples

---

**Thank you for contributing! 🎉**
EOF
}

# Menu principal
echo "Selecione uma opção / Select an option:"
echo "1. Verificar arquivos / Check files"
echo "2. Criar índice / Create index"
echo "3. Criar templates de contribuição / Create contributing templates"
echo "4. Sincronizar tudo / Sync everything"

read -p "Opção (1-4): " option

case $option in
    1)
        check_files
        ;;
    2)
        create_index
        echo "✅ Índice criado / Index created"
        ;;
    3)
        create_contributing
        echo "✅ Templates de contribuição criados / Contributing templates created"
        ;;
    4)
        echo "🔄 Sincronizando tudo / Syncing everything..."
        check_files
        create_index
        create_contributing
        echo "✅ Sincronização completa! / Sync complete!"
        ;;
    *)
        echo "❌ Opção inválida / Invalid option"
        exit 1
        ;;
esac

echo "📚 Documentação atualizada! / Documentation updated!"
