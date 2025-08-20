# 📖 API Documentation - VirtualBox Manager

Base URL: `http://localhost:3001/api`

## 🔐 Authentication

```bash
# Login (development)
POST /api/auth/login
{
  "username": "admin",
  "password": "admin"
}

# Response
{
  "success": true,
  "token": "jwt-token",
  "user": { ... }
}
```

## 🖥️ Virtual Machines

### List VMs
```bash
GET /api/vms?page=1&limit=10&search=windows&status=running
```

### Create VM
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

### Control VM
```bash
POST /api/vms/:id/start     # Start
POST /api/vms/:id/stop      # Stop
POST /api/vms/:id/restart   # Restart
POST /api/vms/:id/pause     # Pause
POST /api/vms/:id/resume    # Resume
```

### VM Screenshot
```bash
GET /api/vms/:id/screenshot
# Returns PNG image
```

### Execute command
```bash
POST /api/vms/:id/execute
{
  "username": "user",
  "password": "pass",
  "command": "ls -la"
}
```

## 📸 Snapshots

### List VM snapshots
```bash
GET /api/snapshots/vm/:vmId
```

### Create snapshot
```bash
POST /api/snapshots/vm/:vmId
{
  "name": "Before-Update",
  "description": "Snapshot before update"
}
```

### Restore snapshot
```bash
POST /api/snapshots/:id/restore
```

### Sync snapshots
```bash
POST /api/snapshots/vm/:vmId/sync
```

## 📜 Scripts

### List scripts
```bash
GET /api/scripts?type=powershell&trigger=startup
```

### Create script
```bash
POST /api/scripts
{
  "name": "Setup-Environment",
  "description": "Initial environment setup",
  "type": "powershell",
  "content": "Write-Host 'Hello World'",
  "trigger": "startup",
  "timeout": 300,
  "associatedVMs": ["vm-id-1", "vm-id-2"]
}
```

### Execute script
```bash
POST /api/scripts/:id/execute
{
  "vmId": "vm-id",
  "environment": {
    "VAR1": "value1"
  }
}
```

### Execution history
```bash
GET /api/scripts/:id/history?page=1&limit=10
```

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Validation error
- `401` - Unauthorized
- `404` - Not found
- `500` - Internal error

## 🔍 Response Examples

### Success
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

### Error
```json
{
  "success": false,
  "message": "VM not found",
  "errors": [...]
}
```

## 🧪 API Testing

### With curl
```bash
# List VMs
curl -X GET http://localhost:3001/api/vms

# Create VM
curl -X POST http://localhost:3001/api/vms \
  -H "Content-Type: application/json" \
  -d '{"name":"Test-VM","osType":"Linux","memory":1024,"cpus":1,"diskSize":10}'
```

### With Postman
Import the collection available at `docs/postman-collection.json`

---

For more examples, see tests in `backend/tests/`
