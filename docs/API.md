# 📖 Documentação da API - VirtualBox Manager

Base URL: `http://localhost:3001/api`

## 🔐 Autenticação

```bash
# Login (desenvolvimento)
POST /api/auth/login
{
  "username": "admin",
  "password": "admin"
}

# Resposta
{
  "success": true,
  "token": "jwt-token",
  "user": { ... }
}
```

## 🖥️ Virtual Machines

### Listar VMs
```bash
GET /api/vms?page=1&limit=10&search=windows&status=running
```

### Criar VM
```bash
POST /api/vms
{
  "name": "Ubuntu-Server",
  "description": "Ubuntu Server 22.04",
  "osType": "Linux",
  "memory": 2048,
  "cpus": 2,
  "diskSize": 20,
  "networkAdapters": [
    { "type": "NAT", "enabled": true }
  ]
}
```

### Controlar VM
```bash
POST /api/vms/:id/start     # Iniciar
POST /api/vms/:id/stop      # Parar
POST /api/vms/:id/restart   # Reiniciar
POST /api/vms/:id/pause     # Pausar
POST /api/vms/:id/resume    # Retomar
```

### Screenshot da VM
```bash
GET /api/vms/:id/screenshot
# Retorna imagem PNG
```

### Executar comando
```bash
POST /api/vms/:id/execute
{
  "username": "user",
  "password": "pass",
  "command": "ls -la"
}
```

## 📸 Snapshots

### Listar snapshots de uma VM
```bash
GET /api/snapshots/vm/:vmId
```

### Criar snapshot
```bash
POST /api/snapshots/vm/:vmId
{
  "name": "Before-Update",
  "description": "Snapshot antes da atualização"
}
```

### Restaurar snapshot
```bash
POST /api/snapshots/:id/restore
```

### Sincronizar snapshots
```bash
POST /api/snapshots/vm/:vmId/sync
```

## 📜 Scripts

### Listar scripts
```bash
GET /api/scripts?type=powershell&trigger=startup
```

### Criar script
```bash
POST /api/scripts
{
  "name": "Setup-Environment",
  "description": "Configura ambiente inicial",
  "type": "powershell",
  "content": "Write-Host 'Hello World'",
  "trigger": "startup",
  "timeout": 300,
  "associatedVMs": ["vm-id-1", "vm-id-2"]
}
```

### Executar script
```bash
POST /api/scripts/:id/execute
{
  "vmId": "vm-id",
  "environment": {
    "VAR1": "value1"
  }
}
```

### Histórico de execução
```bash
GET /api/scripts/:id/history?page=1&limit=10
```

## 📊 Status Codes

- `200` - Sucesso
- `201` - Criado
- `400` - Erro de validação
- `401` - Não autorizado
- `404` - Não encontrado
- `500` - Erro interno

## 🔍 Exemplos de Resposta

### Sucesso
```json
{
  "success": true,
  "message": "VM started successfully",
  "data": {
    "_id": "...",
    "name": "Ubuntu-Server",
    "status": "running"
  }
}
```

### Erro
```json
{
  "success": false,
  "message": "VM not found",
  "errors": [...]
}
```

## 🧪 Testando a API

### Com curl
```bash
# Listar VMs
curl -X GET http://localhost:3001/api/vms

# Criar VM
curl -X POST http://localhost:3001/api/vms \
  -H "Content-Type: application/json" \
  -d '{"name":"Test-VM","osType":"Linux","memory":1024,"cpus":1,"diskSize":10}'
```

### Com Postman
Importe a collection disponível em `docs/postman-collection.json`

---

Para mais exemplos, consulte os testes em `backend/tests/`
