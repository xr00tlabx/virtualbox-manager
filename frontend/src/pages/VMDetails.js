import { useParams } from 'react-router-dom';

function VMDetails() {
    const { id } = useParams();

  return (
      <div>
          <h2>Detalhes da VM</h2>
          <div className="card">
              <p>ID da VM: {id}</p>
              <p>Funcionalidade em desenvolvimento...</p>
          </div>
      </div>
  );
}

export default VMDetails;
