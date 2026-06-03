import React, { useState, useEffect } from 'react';
import './Aquisicoes.css';
import imagemFundo from '../assets/fundo-aquisicoes.png';

function Aquisicoes() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const mockPurchases = [
          { id: 'REQ-2045', fornecedor: 'Dell Computadores', data: '28/05/2026', valor: 25500.00, qtd: 5, status: 'Entregue' },
          { id: 'REQ-2046', fornecedor: 'Oracle Brasil', data: '01/06/2026', valor: 145000.00, qtd: 1, status: 'Processando' },
          { id: 'REQ-2047', fornecedor: 'Kalunga Comércio', data: '02/06/2026', valor: 1200.50, qtd: 15, status: 'Em Trânsito' },
          { id: 'REQ-2048', fornecedor: 'Cisco Systems', data: '02/06/2026', valor: 18400.00, qtd: 2, status: 'Aprovado' }
        ];
        
        setPurchases(mockPurchases);
      } catch (error) {
        console.error("Erro ao buscar aquisições:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return <div className="dashboard-loading">Carregando métricas do sistema...</div>;
  }

  return (
    <div className="aquisicoes-container">
      
      <header className="aquisicoes-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <div className="header-content">
          <div>
            <h1>🛒 Gestão de Aquisições</h1>
            <p>Controlo de compras, fornecedores e entrada de novos ativos.</p>
          </div>
          <button className="btn-primary">
            + Nova Compra
          </button>
        </div>
      </header>

      <section className="metrics-grid aquisicoes-metrics">
        <div className="metric-card highlight">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h3>Investimentos no Mês</h3>
            <p className="metric-value">R$ 45.000,00</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <h3>Novas Entradas (Mês)</h3>
            <p className="metric-value">18</p>
          </div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>Histórico de Pedidos</h2>
          <button className="btn-secondary">Filtrar</button>
        </div>
        
        <div className="table-responsive">
          <table className="custom-table zebrada">
            <thead>
              <tr>
                <th>ID da Compra</th>
                <th>Fornecedor</th>
                <th>Data de Compra</th>
                <th>Valor Total</th>
                <th>Qtd de Itens</th>
                <th>Status de Entrada</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((compra) => (
                <tr key={compra.id}>
                  <td className="fw-bold">{compra.id}</td>
                  <td>{compra.fornecedor}</td>
                  <td>{compra.data}</td>
                  <td className="fw-bold text-success">{formatCurrency(compra.valor)}</td>
                  <td>{compra.qtd}</td>
                  <td>
                    <span className={`status-badge ${compra.status.toLowerCase().replace(' ', '-')}`}>
                      {compra.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon view" title="Ver Detalhes">👁️</button>
                      <button className="btn-icon track" title="Rastrear">🚚</button>
                      <button className="btn-icon receive" title="Dar Entrada">✅</button>
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

export default Aquisicoes;