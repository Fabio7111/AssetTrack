import React, { useState, useEffect } from 'react';
import './Manutencoes.css';
import imagemFundo from '../assets/fundo-manu.png';

function Manutencoes() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const mockChamados = [
          { id: '1042', equipamento: 'Servidor Oracle 19c', tipo: 'Preventiva (P)', solicitante: 'Natã', dtAbert: '01/06/2026', status: 'Em Andamento' },
          { id: '1043', equipamento: 'Extensor Wi-Fi TP-Link', tipo: 'Corretiva (C)', solicitante: 'Fábio', dtAbert: '02/06/2026', status: 'Aberto' },
          { id: '1044', equipamento: 'Laptop VAIO', tipo: 'Corretiva (C)', solicitante: 'Aline', dtAbert: '02/06/2026', status: 'Pendente' },
          { id: '1045', equipamento: 'Switch Core Cisco', tipo: 'Preventiva (P)', solicitante: 'Natã', dtAbert: '28/05/2026', status: 'Concluído' }
        ];
        
        setChamados(mockChamados);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Carregando métricas do sistema...</div>;
  }

  return (
    <div className="manutencoes-container">
      
      <header className="manutencoes-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <div className="header-content">
          <div>
            <h1>🛠️ Gestão de Manutenção</h1>
            <p>Controle de ordens de serviço, preventivas e reparos de hardware.</p>
          </div>
          <button className="btn-primary">
            + Novo Chamado
          </button>
        </div>
      </header>

      <section className="metrics-grid">
        <div className="metric-card warning">
          <div className="metric-icon">🔧</div>
          <div className="metric-info">
            <h3>Em Andamento</h3>
            <p className="metric-value">01</p>
          </div>
        </div>
        
        <div className="metric-card highlight">
          <div className="metric-icon">📅</div>
          <div className="metric-info">
            <h3>Preventivas / Mês</h3>
            <p className="metric-value">12</p>
          </div>
        </div>

        <div className="metric-card dark-mode">
          <div className="metric-icon">⏱️</div>
          <div className="metric-info">
            <h3>Tempo Médio de Reparo</h3>
            <p className="metric-value">03 Dias</p>
          </div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>Fila de Atendimentos</h2>
          <button className="btn-secondary">Filtrar</button>
        </div>
        
        <div className="table-responsive">
          <table className="custom-table zebrada">
            <thead>
              <tr>
                <th>ID</th>
                <th>Equipamentos</th>
                <th>Tipo (P/C)</th>
                <th>Solicitante</th>
                <th>Dt Abert</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((chamado) => (
                <tr key={chamado.id}>
                  <td className="fw-bold">{chamado.id}</td>
                  <td>{chamado.equipamento}</td>
                  <td>{chamado.tipo}</td>
                  <td>{chamado.solicitante}</td>
                  <td>{chamado.dtAbert}</td>
                  <td>
                    <span className={`status-badge ${chamado.status.toLowerCase().replace(' ', '-')}`}>
                      {chamado.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon edit" title="Editar">✏️</button>
                      <button className="btn-icon check" title="Finalizar">✅</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Manutencoes;