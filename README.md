# VirtualBox Manager

Um sistema completo para gerenciamento de máquinas virtuais VirtualBox com interface web moderna.

## 🚀 Funcionalidades

### Backend (Node.js + Express)
- ✅ API RESTful completa
- ✅ Controle de VMs (criar, iniciar, parar, reiniciar, pausar, excluir)
- ✅ Gerenciamento de snapshots (criar, restaurar, excluir)
- ✅ Sistema de scripts (PowerShell, Batch, VBS, JavaScript, Bash)
- ✅ Execução de scripts em inicialização/desligamento
- ✅ Envio de comandos para VMs ligadas
- ✅ Captura de screenshots das VMs
- ✅ Integração com MongoDB
- ✅ Sistema de logging avançado
- ✅ Validação de dados e tratamento de erros
- ✅ Documentação da API

### Frontend (React.js)
- ✅ Interface moderna com Material-UI
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gerenciamento visual de VMs
- ✅ Sistema de navegação responsivo
- ✅ Notificações em tempo real
- ✅ Busca e filtros avançados

## 📁 Estrutura do Projeto

```
virtualbox-manager/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── models/         # Modelos do MongoDB
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços (VirtualBox, etc.)
│   │   ├── middleware/     # Middlewares personalizados
│   │   ├── utils/          # Utilitários
│   │   └── config/         # Configurações
│   ├── scripts/            # Scripts de automação
│   ├── tests/              # Testes automatizados
│   └── Dockerfile          # Container Docker
├── frontend/               # Interface React.js
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilitários
│   └── public/             # Arquivos públicos
├── docs/                   # Documentação
├── scripts/                # Scripts de setup/deploy
└── docker-compose.yml      # Orquestração Docker
```

## 🛠 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Winston** - Sistema de logging
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Validação de dados

### Frontend
- **React.js** - Biblioteca UI
- **Material-UI** - Componentes UI
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado server
- **Axios** - Cliente HTTP
- **React Hook Form** - Formulários
- **React Hot Toast** - Notificações
- **Framer Motion** - Animações

### DevOps
- **Docker** - Containerização
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Jest** - Testes automatizados

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- MongoDB
- VirtualBox instalado
- Git

### 1. Clone o repositório
```bash
git clone <repository-url>
cd virtualbox-manager
```

### 2. Configure o Backend
```bash
cd backend
npm install
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Configure o Frontend
```bash
cd ../frontend
npm install
```

### 4. Inicie os serviços

#### Desenvolvimento
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - MongoDB (se não estiver rodando como serviço)
mongod
```

#### Produção com Docker
```bash
docker-compose up -d
```

## 📖 Documentação da API

### Endpoints Principais

#### VMs
- `GET /api/vms` - Listar VMs
- `POST /api/vms` - Criar VM
- `GET /api/vms/:id` - Detalhes da VM
- `PUT /api/vms/:id` - Atualizar VM
- `DELETE /api/vms/:id` - Excluir VM
- `POST /api/vms/:id/start` - Iniciar VM
- `POST /api/vms/:id/stop` - Parar VM
- `POST /api/vms/:id/restart` - Reiniciar VM
- `GET /api/vms/:id/screenshot` - Screenshot da VM

#### Snapshots
- `GET /api/snapshots` - Listar snapshots
- `POST /api/snapshots/vm/:vmId` - Criar snapshot
- `POST /api/snapshots/:id/restore` - Restaurar snapshot
- `DELETE /api/snapshots/:id` - Excluir snapshot

#### Scripts
- `GET /api/scripts` - Listar scripts
- `POST /api/scripts` - Criar script
- `POST /api/scripts/:id/execute` - Executar script
- `GET /api/scripts/:id/history` - Histórico de execução

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Backend (.env)
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/virtualbox-manager
FRONTEND_URL=http://localhost:3000
VM_STORAGE_PATH=C:\VirtualBox VMs
LOG_LEVEL=info
```

### VirtualBox
Certifique-se de que o VBoxManage está no PATH do sistema ou configure o caminho completo no código.

## 🐳 Docker

### Build e execução
```bash
# Build das imagens
docker-compose build

# Executar em produção
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 📊 Monitoramento e Logs

- Logs do backend: `backend/logs/`
- Health check: `GET /health`
- Métricas em tempo real no dashboard

## 🧪 Testes

```bash
# Backend
cd backend
npm test
npm run test:coverage

# Frontend
cd frontend
npm test
```

## 🚀 Deploy

### Produção Manual
1. Configure variáveis de ambiente
2. Build do frontend: `npm run build`
3. Inicie o backend: `npm start`
4. Configure proxy reverso (nginx)

### Deploy com Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🔗 Links Úteis

- [VirtualBox Documentation](https://www.virtualbox.org/manual/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

---

**VirtualBox Manager** - Gerenciamento moderno e eficiente de máquinas virtuais 🖥️
