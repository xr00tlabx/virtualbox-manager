import axios from 'axios';
import { useEffect, useState } from 'react';

function VirtualMachines() {
    const [vms, setVms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVMs();
    }, []);

    const fetchVMs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/vms');
            setVms(response.data);
        } catch (err) {
            setError('Erro ao carregar VMs');
            console.error('Error fetching VMs:', err);
        } finally {
            setLoading(false);
    }
  };

    const handleStart = async (vmId) => {
        try {
            await axios.post(`/api/vms/${vmId}/start`);
            fetchVMs(); // Refresh the list
        } catch (err) {
            console.error('Error starting VM:', err);
    }
  };

    const handleStop = async (vmId) => {
        try {
            await axios.post(`/api/vms/${vmId}/stop`);
            fetchVMs(); // Refresh the list
        } catch (err) {
            console.error('Error stopping VM:', err);
    }
  };

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
      <div>
          <h2>Máquinas Virtuais</h2>

          <div className="card">
              <button className="btn" onClick={fetchVMs}>Atualizar Lista</button>
          </div>

          {vms.length === 0 ? (
              <div className="card">
                  <p>Nenhuma VM encontrada</p>
              </div>
          ) : (
              vms.map((vm) => (
                  <div key={vm.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                              <h3>{vm.name}</h3>
                              <p>Estado: <span style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: vm.state === 'running' ? '#d4edda' : '#f8d7da',
                                  color: vm.state === 'running' ? '#155724' : '#721c24'
                              }}>
                                  {vm.state}
                              </span></p>
                              <p>OS: {vm.ostype || 'N/A'}</p>
                              <p>RAM: {vm.memory || 'N/A'} MB</p>
                          </div>
                          <div>
                              {vm.state === 'running' ? (
                                  <button className="btn btn-danger" onClick={() => handleStop(vm.id)}>
                                      Parar
                                  </button>
                              ) : (
                                  <button className="btn" onClick={() => handleStart(vm.id)}>
                                      Iniciar
                                  </button>
                              )}
                        <button className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
                            Detalhes
                        </button>
                    </div>
                </div>
            </div>
        ))
          )}
      </div>
  );
}

export default VirtualMachines;
