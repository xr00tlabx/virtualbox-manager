# Configuração de Idiomas / Language Configuration

Este repositório suporta documentação e commits em português e inglês.  
This repository supports documentation and commits in Portuguese and English.

## 📝 Convenções de Commit / Commit Conventions

### Formato / Format
```
🎯 [PT/EN] <tipo>: <descrição>

<corpo em português>

---

<body in English>
```

### Exemplo / Example
```
🎯 [PT/EN] feat: Adiciona sistema de snapshots automáticos

- Implementa agendamento de snapshots
- Configura limpeza automática
- Adiciona validação de limites

---

- Implements snapshot scheduling
- Configures automatic cleanup  
- Adds limit validation
```

## 📋 Tipos de Commit / Commit Types

| Emoji | Tipo/Type | PT | EN |
|-------|-----------|----|----|
| ✨ | feat | Nova funcionalidade | New feature |
| 🐛 | fix | Correção de bug | Bug fix |
| 📚 | docs | Documentação | Documentation |
| 💄 | style | Estilo/formatação | Style/formatting |
| ♻️ | refactor | Refatoração | Refactoring |
| ⚡ | perf | Performance | Performance |
| 🧪 | test | Testes | Tests |
| 🔧 | chore | Manutenção | Maintenance |
| 💥 | BREAKING | Mudança breaking | Breaking change |

## 🌐 Estrutura de Documentação / Documentation Structure

```
docs/
├── README.md           # Bilíngue/Bilingual
├── pt/                 # Português
│   ├── API.md
│   ├── QUICK_START.md
│   └── CONTRIBUTING.md
├── en/                 # English
│   ├── API.md
│   ├── QUICK_START.md
│   └── CONTRIBUTING.md
└── templates/          # Templates bilíngues
```

## 🛠 Scripts de Automação / Automation Scripts

Use os scripts para facilitar commits bilíngues:
Use scripts to facilitate bilingual commits:

```bash
# Commit bilíngue
npm run commit

# Gerar documentação
npm run docs:generate

# Sincronizar traduções
npm run docs:sync
```
