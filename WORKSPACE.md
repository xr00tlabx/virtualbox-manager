# 🛠️ VirtualBox Manager Workspace

## Estrutura do Projeto

- `backend/` — API Node.js + Express
- `frontend/` — Interface React.js

## Como iniciar cada parte

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Instruções para o Copilot

- Sempre mantenha os arquivos do backend dentro de `backend/` e do frontend em `frontend/`.
- Documentação geral deve ficar na raiz ou em `docs/`.
- Para scripts, utilize o diretório `scripts/` na raiz.
- Para commits e PRs, siga o padrão bilíngue:
  - `feat: Adiciona integração X | Add integration X`
- Issues e PRs devem ser criados via templates em `.github/ISSUE_TEMPLATE/` e `.github/pull_request_template.md`.

## Instruções para o GitHub

- O repositório está pronto para integração com GitHub Actions, Issues e Pull Requests.
- Use os templates para padronizar contribuições.
- Sempre descreva mudanças em português e inglês.
- Para dúvidas, consulte os arquivos `README.md` e `README.en.md`.

---

**Dica:** Use o VS Code em modo multi-root para editar backend e frontend simultaneamente.
