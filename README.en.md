# VirtualBox Manager

A complete system for managing VirtualBox virtual machines with a modern web interface.

## 🚀 Features

### Backend (Node.js + Express)
- ✅ Full RESTful API
- ✅ VM control (create, start, stop, restart, pause, delete)
- ✅ Snapshot management (create, restore, delete)
- ✅ Script system (PowerShell, Batch, VBS, JavaScript, Bash)
- ✅ Script execution on startup/shutdown
- ✅ Send commands to running VMs
- ✅ VM screenshot capture
- ✅ MongoDB integration
- ✅ Advanced logging system
- ✅ Data validation and error handling
- ✅ API documentation

### Frontend (React.js)
- ✅ Modern interface with Material-UI
- ✅ Real-time dashboard
- ✅ Visual VM management
- ✅ Responsive navigation system
- ✅ Real-time notifications
- ✅ Advanced search and filters

## 📁 Project Structure

```
virtualbox-manager/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Services (VirtualBox, etc.)
│   │   ├── middleware/     # Custom middlewares
│   │   ├── utils/          # Utilities
│   │   └── config/         # Configurations
│   ├── scripts/            # Automation scripts
│   ├── tests/              # Automated tests
│   └── Dockerfile          # Docker container
├── frontend/               # React.js interface
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilities
│   └── public/             # Public files
├── docs/                   # Documentation
├── scripts/                # Setup/deploy scripts
└── docker-compose.yml      # Docker orchestration
```

## 🛠 Technologies

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Winston**
- **Helmet**
- **CORS**
- **Express Rate Limit**
- **Express Validator**

### Frontend
- **React.js**
- **Material-UI**
- **React Router**
- **React Query**
- **Axios**
- **React Hook Form**
- **React Hot Toast**
- **Framer Motion**

### DevOps
- **Docker**
- **ESLint**
- **Prettier**
- **Jest**

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB
- VirtualBox
- Git

### 1. Clone the repository
```bash
git clone <repository-url>
cd virtualbox-manager
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

### 4. Start services

#### Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - MongoDB (if not running as a service)
mongod
```

#### Production with Docker
```bash
docker-compose up -d
```

## 📖 API Documentation

See `docs/API.en.md` for full API reference.

## 🧪 Testing

```bash
# Backend
cd backend
npm test
npm run test:coverage

# Frontend
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the project
2. Create a branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request

## 📄 License

This project is MIT licensed. See [LICENSE](LICENSE) for details.

## 🔗 Useful Links

- [VirtualBox Documentation](https://www.virtualbox.org/manual/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)

## 📞 Support

For support, open a GitHub issue or contact via email.

---

**VirtualBox Manager** - Modern and efficient VM management 🖥️
