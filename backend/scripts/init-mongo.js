// Script de inicialização do MongoDB
db = db.getSiblingDB('virtualbox-manager');

// Criar usuário para a aplicação
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'virtualbox-manager'
    }
  ]
});

// Criar índices iniciais
db.vms.createIndex({ name: 1 }, { unique: true });
db.vms.createIndex({ status: 1 });
db.vms.createIndex({ createdAt: -1 });

db.snapshots.createIndex({ vmId: 1, createdAt: -1 });
db.snapshots.createIndex({ vmId: 1, name: 1 }, { unique: true });

db.scripts.createIndex({ name: 1 }, { unique: true });
db.scripts.createIndex({ type: 1 });
db.scripts.createIndex({ trigger: 1 });

print('MongoDB initialization completed successfully!');
