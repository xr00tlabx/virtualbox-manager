# 🚀 Quick Start Guide - VirtualBox Manager

## ✅ Prerequisites

Before getting started, make sure you have installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
- **VirtualBox** - [Download](https://www.virtualbox.org/wiki/Downloads)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Automatic Installation

### Windows
```bash
# Run the setup script
.\scripts\setup.bat
```

### Linux/macOS
```bash
# Make script executable and run
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## 🛠️ Manual Installation

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd virtualbox-manager
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

### 4. Configure environment variables
Edit the `backend/.env` file:
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/virtualbox-manager
FRONTEND_URL=http://localhost:3000
VM_STORAGE_PATH=C:\VirtualBox VMs
LOG_LEVEL=info
```

## 🚀 Running the Project

### Development
```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - Frontend
cd frontend
npm start
```

### Using Docker
```bash
docker-compose up -d
```

## 🌐 Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📋 Verification Checklist

- [ ] Node.js installed and working
- [ ] MongoDB running on port 27017
- [ ] VirtualBox installed and VBoxManage in PATH
- [ ] Dependencies installed (npm install)
- [ ] .env file configured
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] No errors in console

## 🐛 Troubleshooting

### MongoDB won't connect
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB manually
mongod
```

### VBoxManage not found
```bash
# Windows: Add to PATH
set PATH=%PATH%;C:\Program Files\Oracle\VirtualBox

# Linux/macOS: Install VirtualBox
sudo apt-get install virtualbox  # Ubuntu
brew install virtualbox          # macOS
```

### Port already in use
```bash
# Check which ports are in use
netstat -an | findstr :3001
netstat -an | findstr :3000

# Kill processes if needed
npx kill-port 3001
npx kill-port 3000
```

## 📚 Next Steps

1. ✅ Access the dashboard at http://localhost:3000
2. 🖥️ Create your first VM
3. 📸 Test snapshots
4. 📜 Configure automation scripts
5. 📖 Read complete documentation in README.md

## 🆘 Support

If you encounter problems:
1. Check the checklist above
2. Check logs in `backend/logs/`
3. Open an issue on GitHub
4. Consult complete documentation

---

**Ready to get started! 🎉**
