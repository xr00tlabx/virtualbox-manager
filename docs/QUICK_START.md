# 🚀 Guia de Instalação Rápida - VirtualBox Manager

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
- **VirtualBox** - [Download](https://www.virtualbox.org/wiki/Downloads)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Instalação Automática

### Windows
```bash
# Execute o script de setup
.\scripts\setup.bat
```

### Linux/macOS
```bash
# Torne o script executável e execute
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## 🛠️ Instalação Manual

### 1. Clone o repositório
```bash
git clone <seu-repositorio-url>
cd virtualbox-manager
```

### 2. Configure o Backend
```bash
cd backend
npm install
cp .env.example .env
```

### 3. Configure o Frontend
```bash
cd ../frontend
npm install
```

### 4. Configure as variáveis de ambiente
Edite o arquivo `backend/.env`:
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/virtualbox-manager
FRONTEND_URL=http://localhost:3000
VM_STORAGE_PATH=C:\VirtualBox VMs
LOG_LEVEL=info
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
# Terminal 1 - Inicie o MongoDB
mongod

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - Frontend
cd frontend
npm start
```

### Usando Docker
```bash
docker-compose up -d
```

## 🌐 Acessando a Aplicação

- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📋 Checklist de Verificação

- [ ] Node.js instalado e funcionando
- [ ] MongoDB rodando na porta 27017
- [ ] VirtualBox instalado e VBoxManage no PATH
- [ ] Dependências instaladas (npm install)
- [ ] Arquivo .env configurado
- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 3000
- [ ] Sem erros no console

## 🐛 Solução de Problemas

### MongoDB não conecta
```bash
# Verifique se o MongoDB está rodando
mongod --version

# Inicie o MongoDB manualmente
mongod
```

### VBoxManage não encontrado
```bash
# Windows: Adicione ao PATH
set PATH=%PATH%;C:\Program Files\Oracle\VirtualBox

# Linux/macOS: Instale o VirtualBox
sudo apt-get install virtualbox  # Ubuntu
brew install virtualbox          # macOS
```

### Porta já em uso
```bash
# Verifique quais portas estão em uso
netstat -an | findstr :3001
netstat -an | findstr :3000

# Mate processos se necessário
npx kill-port 3001
npx kill-port 3000
```

## 📚 Próximos Passos

1. ✅ Acesse o dashboard em http://localhost:3000
2. 🖥️ Crie sua primeira VM
3. 📸 Teste snapshots
4. 📜 Configure scripts de automação
5. 📖 Leia a documentação completa no README.md

## 🆘 Suporte

Se encontrar problemas:
1. Verifique o checklist acima
2. Consulte os logs em `backend/logs/`
3. Abra uma issue no GitHub
4. Consulte a documentação completa

---

**Pronto para começar! 🎉**
