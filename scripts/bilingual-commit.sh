#!/bin/bash

# Script para commits bilíngues (PT/EN)
# Bilingual commit script (PT/EN)

echo "🌍 Commit Bilíngue / Bilingual Commit"
echo "===================================="

# Tipos de commit
echo "Selecione o tipo de commit / Select commit type:"
echo "1. ✨ feat - Nova funcionalidade / New feature"
echo "2. 🐛 fix - Correção de bug / Bug fix"
echo "3. 📚 docs - Documentação / Documentation"
echo "4. 💄 style - Estilo/formatação / Style/formatting"
echo "5. ♻️ refactor - Refatoração / Refactoring"
echo "6. ⚡ perf - Performance / Performance"
echo "7. 🧪 test - Testes / Tests"
echo "8. 🔧 chore - Manutenção / Maintenance"
echo "9. 💥 BREAKING - Mudança breaking / Breaking change"

read -p "Digite o número (1-9): " type_num

case $type_num in
    1) emoji="✨"; type="feat" ;;
    2) emoji="🐛"; type="fix" ;;
    3) emoji="📚"; type="docs" ;;
    4) emoji="💄"; type="style" ;;
    5) emoji="♻️"; type="refactor" ;;
    6) emoji="⚡"; type="perf" ;;
    7) emoji="🧪"; type="test" ;;
    8) emoji="🔧"; type="chore" ;;
    9) emoji="💥"; type="BREAKING" ;;
    *) echo "Opção inválida / Invalid option"; exit 1 ;;
esac

# Título em português
read -p "Título em português: " title_pt

# Título em inglês
read -p "Title in English: " title_en

# Descrição em português
echo "Descrição em português (Enter para finalizar, linha vazia para parar):"
description_pt=""
while IFS= read -r line; do
    [[ -z "$line" ]] && break
    description_pt+="- $line"$'\n'
done

# Descrição em inglês
echo "Description in English (Enter to finish, empty line to stop):"
description_en=""
while IFS= read -r line; do
    [[ -z "$line" ]] && break
    description_en+="- $line"$'\n'
done

# Criar mensagem de commit
commit_message="$emoji [PT/EN] $type: $title_pt

$description_pt
---

$title_en

$description_en"

# Mostrar preview
echo ""
echo "📋 Preview do commit / Commit preview:"
echo "======================================"
echo "$commit_message"
echo "======================================"

read -p "Confirmar commit? (y/n): " confirm

if [[ $confirm == "y" || $confirm == "Y" ]]; then
    git add .
    git commit -m "$commit_message"
    echo "✅ Commit realizado com sucesso! / Commit successful!"
else
    echo "❌ Commit cancelado / Commit cancelled"
fi
