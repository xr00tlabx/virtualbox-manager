# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [1.0.0] - 2025-08-20

### ✨ Adicionado
- Projeto inicial do VirtualBox Manager
- Backend API RESTful com Node.js + Express
- Frontend React.js com Material-UI
- Gerenciamento completo de VMs (criar, iniciar, parar, pausar, excluir)
- Sistema de snapshots (criar, restaurar, excluir)
- Sistema de scripts (PowerShell, Batch, VBS, JavaScript, Bash)
- Execução de scripts em inicialização/desligamento
- Captura de screenshots das VMs
- Dashboard com estatísticas em tempo real
- Sistema de logging avançado
- Validação de dados e tratamento de erros
- Integração com MongoDB
- Containerização com Docker
- Pipeline CI/CD com GitHub Actions
- Documentação completa
- Templates para Issues e Pull Requests
- Scripts de setup automático

### 🏗️ Arquitetura
- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Material-UI, React Query, React Router
- DevOps: Docker, GitHub Actions, ESLint, Prettier
- Segurança: Helmet, CORS, Rate Limiting
- Logging: Winston com rotação de arquivos
- Testes: Jest, Supertest

### 📁 Estrutura
```
virtualbox-manager/
├── backend/          # API Node.js + Express
├── frontend/         # Interface React.js
├── docs/            # Documentação
├── scripts/         # Scripts de automação
└── .github/         # Templates e workflows
```

### 🚀 Funcionalidades
- ✅ Controle completo de VMs VirtualBox
- ✅ Gerenciamento de snapshots
- ✅ Sistema de scripts personalizados
- ✅ Dashboard interativo
- ✅ Interface responsiva
- ✅ API RESTful documentada
- ✅ Sistema de autenticação básico
- ✅ Notificações em tempo real
- ✅ Busca e filtros avançados
