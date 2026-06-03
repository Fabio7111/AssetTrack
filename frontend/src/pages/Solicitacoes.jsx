import React, { useState, useEffect } from 'react';
import './Solicitacoes.css';
import imagemFundo from '../assets/fundo-solic.png';

function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const mockSolicitacoes = [
          { id: 'REQ-2041', tipo: 'Manutenção', assunto: 'Monitor não liga', equipamento: 'Monitor Dell 27"', data: '02/06/2026', status: 'Em Atendimento', avaliado: null },
          { id: 'REQ-2038', tipo: 'Estoque', assunto: 'Solicitação de Mouse Sem Fio', equipamento: '--', data: '01/06/2026', status: 'Aprovado', avaliado: null },
          { id: 'REQ-2025', tipo: 'Manutenção', assunto: 'Teclado com falha nas teclas', equipamento: 'Laptop VAIO', data: '25/05/2026', status: 'Resolvido', avaliado: false }, // Requer avaliação!
          { id: 'REQ-2010', tipo: 'Manutenção', assunto: 'Lentidão no sistema', equipamento: 'Desktop Setor RH', data: '10/05/2026', status: 'Fechado', avaliado: true, nota: 5 },
          { id: 'REQ-2005', tipo: 'Estoque', assunto: 'Cabo de Rede (2 metros)', equipamento: '--', data: '05/05/2026', status: 'Entregue', avaliado: null }
        ];
        
        setSolicitacoes(mockSolicitacoes);
      } catch (error) {
        console.error("Erro ao buscar solicitações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
  }, []);

  const handleAvaliar = (id) => {
    alert(`Abrindo formulário de avaliação para o chamado ${id}...\nAqui o usuário dará de 1 a 5 estrelas e deixará um comentário.`);
  };

  if (loading) {
    return <div className="dashboard-loading">Carregando métricas do sistema...</div>;
  }

  return (
    <div className="solicitacoes-container">
      
      <header className="solicitacoes-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <div className="header-content">
          <div>
            <h1>🎫 Minhas Solicitações</h1>
            <p>Acompanhe os seus chamados de suporte técnico e pedidos de materiais.</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary dark">Pedir Material</button>
            <button className="btn-primary">Abrir Chamado TI</button>
          </div>
        </div>
      </header>

      <section className="metrics-grid">
        <div className="metric-card highlight">
          <div className="metric-icon">🛠️</div>
          <div className="metric-info">
            <h3>Em Atendimento</h3>
            <p className="metric-value">01</p>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">⭐</div>
          <div className="metric-info">
            <h3>Aguardando Avaliação</h3>
            <p className="metric-value">01</p>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <h3>Resolvidos (Mês)</h3>
            <p className="metric-value">03</p>
          </div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>Histórico de Chamados</h2>
          <div className="table-actions">
            <input type="text" placeholder="Buscar ticket..." className="search-input-small" />
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="custom-table zebrada">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Tipo</th>
                <th>Assunto / Problema</th>
                <th>Equipamento Relacionado</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((req) => (
                <tr key={req.id}>
                  <td className="fw-bold">{req.id}</td>
                  <td>
                    <span className={`tipo-tag ${req.tipo === 'Estoque' ? 'estoque' : 'manutencao'}`}>
                      {req.tipo}
                    </span>
                  </td>
                  <td>{req.assunto}</td>
                  <td>{req.equipamento}</td>
                  <td>{req.data}</td>
                  <td>
                    <span className={`status-badge ${req.status.toLowerCase().replace(' ', '-')}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon view" title="Ver Histórico">👁️</button>
                      
                      {req.avaliado === false && req.tipo === 'Manutenção' && (
                        <button 
                          className="btn-icon evaluate animate-pulse" 
                          title="Avaliar Atendimento"
                          onClick={() => handleAvaliar(req.id)}
                        >
                          ⭐
                        </button>
                      )}
                      
                      {req.avaliado === true && (
                        <span className="nota-exibicao" title="Sua nota">
                          {req.nota}★
                        </span>
                      )}
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

export default Solicitacoes;