import React, { useState, useEffect } from 'react';
import './Equipamentos.css';
import imagemFundo from '../assets/fundo-equipam.png';

function Equipamentos() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockEquipments = [
          { id: 1, modelo: 'Notebook Dell XPS 13', patrimonio: 'ASSIS-NTB-010', setor: 'TI / Desenvolvimento', tipo: 'Informática', ultimaInspecao: '15/05/2026', status: 'Ativo' },
          { id: 2, modelo: 'Switch Cisco Catalyst 9300', patrimonio: 'ASSIS-SWI-002', setor: 'TI / Rede', tipo: 'Infraestrutura', ultimaInspecao: '01/06/2026', status: 'Em Manutenção' },
          { id: 3, modelo: 'Monitor Dell 27"', patrimonio: 'ASSIS-MON-045', setor: 'RH', tipo: 'Periférico', ultimaInspecao: '10/04/2026', status: 'Ativo' },
          { id: 4, modelo: 'Servidor HP ProLiant DL360', patrimonio: 'ASSIS-SRV-001', setor: 'TI / Data Center', tipo: 'Infraestrutura', ultimaInspecao: '12/06/2026', status: 'Ativo' },
          { id: 5, modelo: 'Nobreak APC 3KVA', patrimonio: 'ASSIS-POW-003', setor: 'TI / Rede', tipo: 'Energia', ultimaInspecao: '18/06/2026', status: 'Agendado' },
          { id: 6, modelo: 'Estação de Trabalho - TI', patrimonio: 'ASSIS-WKT-015', setor: 'TI / Suporte', tipo: 'Informática', ultimaInspecao: '05/06/2026', status: 'Desativado' }
        ];
        
        setEquipments(mockEquipments);
      } catch (error) {
        console.error("Erro ao buscar equipamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Carregando métricas do sistema...</div>;
  }

  return (
    <div className="equipamentos-container">
      
      <header className="equipamentos-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <div className="header-content">
          <div>
            <h1>💻 Gestão de Equipamentos e Ativos</h1>
            <p>Espaço reservado para a listagem e cadastro de ativos.</p>
          </div>
          <button className="btn-primary">
            + Novo Ativo
          </button>
        </div>
      </header>

      <section className="metrics-grid">
        <div className="metric-card highlight">
          <div className="metric-icon">🏢</div>
          <div className="metric-info">
            <h3>Total de Equipamentos</h3>
            <p className="metric-value">154</p>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">🔧</div>
          <div className="metric-info">
            <h3>Em Manutenção</h3>
            <p className="metric-value">15</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <h3>Ativos em Estoque</h3>
            <p className="metric-value">22</p>
          </div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>🔧 Detalhamento de Ativos</h2>
          <button className="btn-secondary">Exportar para Excel</button>
        </div>
        
        <div className="table-responsive">
          <table className="custom-table zebrada">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Patrimônio</th>
                <th>Setor/Local</th>
                <th>Tipo</th>
                <th>Última Insp.</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((eq) => (
                <tr key={eq.id}>
                  <td className="fw-bold">{eq.modelo}</td>
                  <td>{eq.patrimonio}</td>
                  <td>{eq.setor}</td>
                  <td>{eq.tipo}</td>
                  <td>{eq.ultimaInspecao}</td>
                  <td>
                    <span className={`status-badge ${eq.status.toLowerCase().replace(' ', '-')}`}>
                      {eq.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon edit" title="Editar">✏️</button>
                      <button className="btn-icon history" title="Ver Histórico">📜</button>
                      <button className="btn-icon disable" title="Desativar">🚫</button>
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

export default Equipamentos;