import axios from 'axios';
import { useEffect, useState } from 'react';

function Dashboard() {
    const [vms, setVms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulando dados para mostrar a interface
        setTimeout(() => {
            setVms([
                { id: 1, name: 'Windows 10 Dev', state: 'running', ostype: 'Windows', memory: '4096' },
                { id: 2, name: 'Ubuntu Server', state: 'poweroff', ostype: 'Linux', memory: '2048' },
                { id: 3, name: 'CentOS Docker', state: 'paused', ostype: 'Linux', memory: '1024' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const fetchVMs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/vms');
            setVms(response.data);
        } catch (err) {
            setError('Erro ao carregar VMs - Usando dados de exemplo');
            console.error('Error fetching VMs:', err);
            // Fallback para dados de exemplo
            setVms([
                { id: 1, name: 'Windows 10 Dev', state: 'running', ostype: 'Windows', memory: '4096' },
                { id: 2, name: 'Ubuntu Server', state: 'poweroff', ostype: 'Linux', memory: '2048' },
                { id: 3, name: 'CentOS Docker', state: 'paused', ostype: 'Linux', memory: '1024' },
            ]);
        } finally {
            setLoading(false);
    }
  };

    const getStatusColor = (state) => {
        switch (state) {
            case 'running': return 'running';
            case 'paused': return 'paused';
            default: return 'poweroff';
    }
  };

    if (loading) return <div className="loading">🔄 Carregando dashboard...</div>;

  return (
      <div>
          <div className="page-header">
              <h1>Dashboard</h1>
              <p>Visão geral das suas máquinas virtuais</p>
          </div>

          {error && (
              <div className="error">
                  ⚠️ {error}
              </div>
          )}

          <div className="dashboard-grid">
              <div className="card stats-card">
                  <h3>📊 Estatísticas Gerais</h3>
                  <div className="stats-grid">
                      <div className="stat-item">
                          <span className="stat-number">{vms.length}</span>
                          <span className="stat-label">Total de VMs</span>
                      </div>
                      <div className="stat-item success">
                          <span className="stat-number">{vms.filter(vm => vm.state === 'running').length}</span>
                          <span className="stat-label">Ativas</span>
                      </div>
                      <div className="stat-item warning">
                          <span className="stat-number">{vms.filter(vm => vm.state === 'paused').length}</span>
                          <span className="stat-label">Pausadas</span>
                      </div>
                      <div className="stat-item danger">
                          <span className="stat-number">{vms.filter(vm => vm.state === 'poweroff').length}</span>
                          <span className="stat-label">Paradas</span>
                      </div>
                  </div>
              </div>

              <div className="card quick-actions-card">
                  <h3>⚡ Ações Rápidas</h3>
                  <div className="quick-actions">
                      <button className="btn btn-primary">
                          <span>➕</span>
                          Nova VM
                      </button>
                      <button className="btn btn-secondary">
                          <span>📥</span>
                          Importar
                      </button>
                      <button className="btn btn-secondary">
                          <span>💾</span>
                          Backup
                      </button>
                      <button className="btn btn-secondary" onClick={fetchVMs}>
                          <span>🔄</span>
                          Atualizar
                      </button>
                  </div>
              </div>
          </div>

          <div className="card">
              <div className="card-header">
                  <h3>💻 Máquinas Virtuais</h3>
                  <button className="btn btn-sm btn-secondary" onClick={fetchVMs}>
                      🔄 Atualizar
                  </button>
              </div>

              {vms.length === 0 ? (
                  <div className="empty-state">
                      <div className="empty-icon">📱</div>
                      <h4>Nenhuma VM encontrada</h4>
                      <p>Comece criando sua primeira máquina virtual</p>
                      <button className="btn btn-primary">
                          ➕ Criar Nova VM
                      </button>
                  </div>
              ) : (
                  <div className="vm-list">
                      {vms.map((vm) => (
                          <div key={vm.id} className="vm-item">
                              <div className="vm-info">
                                  <div className="vm-header">
                                      <h4 className="vm-name">💻 {vm.name}</h4>
                                      <span className={`vm-status ${getStatusColor(vm.state)}`}>
                                          {vm.state === 'running' ? '🟢' : vm.state === 'paused' ? '🟡' : '🔴'}
                                          {vm.state}
                                      </span>
                                  </div>
                                  <div className="vm-details">
                                      <span className="vm-detail">🖥️ {vm.ostype || 'N/A'}</span>
                                      <span className="vm-detail">💾 {vm.memory || 'N/A'} MB</span>
                                  </div>
                              </div>
                              <div className="vm-actions">
                                  {vm.state === 'running' ? (
                                      <>
                                          <button className="btn btn-sm btn-secondary">⏸️ Pausar</button>
                                          <button className="btn btn-sm btn-danger">⏹️ Parar</button>
                                      </>
                                  ) : (
                            <button className="btn btn-sm btn-primary">▶️ Iniciar</button>
                        )}
                        <button className="btn btn-sm btn-secondary">⚙️ Detalhes</button>
                    </div>
                </div>
            ))}
                  </div>
              )}
          </div>
      </div>
  );
}

export default Dashboard;
