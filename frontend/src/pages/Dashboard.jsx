import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import imagemFundo from '../assets/fundo-dashboard.png';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockMetrics = {
          totalAssets: 1248,
          totalValue: 345000.00,
          pendingAudits: 2,
          alerts: 5
        };

        const mockMaintenances = [
          { id: 'MAN-1042', equipment: 'Servidor Oracle 19c', type: 'Preventiva', date: '05/06/2026', status: 'Atrasada' },
          { id: 'MAN-1043', equipment: 'Switch Core', type: 'Corretiva', date: '10/06/2026', status: 'Pendente' },
          { id: 'MAN-1044', equipment: 'Nobreak APC 3KVA', type: 'Preventiva', date: '12/06/2026', status: 'Agendada' },
          { id: 'MAN-1045', equipment: 'Estação de Trabalho - TI', type: 'Upgrade', date: '15/06/2026', status: 'Agendada' }
        ];

        setMetrics(mockMetrics);
        setMaintenances(mockMaintenances);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return <div className="dashboard-loading">Carregando métricas do sistema...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <h1>Dashboard Geral</h1>
        <p>Bem Vindo ao AssetTrack - Sistema de Gestão de Equipamentos</p>
      </header>

      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💻</div>
          <div className="metric-info">
            <h3>Total de Ativos</h3>
            <p className="metric-value">{metrics.totalAssets}</p>
          </div>
        </div>
        
        <div className="metric-card highlight">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h3>Patrimônio Líquido</h3>
            <p className="metric-value">{formatCurrency(metrics.totalValue)}</p>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">📋</div>
          <div className="metric-info">
            <h3>Auditorias Pendentes</h3>
            <p className="metric-value">{metrics.pendingAudits}</p>
          </div>
        </div>

        <div className="metric-card danger">
          <div className="metric-icon">⚠️</div>
          <div className="metric-info">
            <h3>Alertas do Sistema</h3>
            <p className="metric-value">{metrics.alerts}</p>
          </div>
        </div>
      </section>

      <section className="dashboard-table-section">
        <div className="section-header">
          <h2>🔧 Manutenções Preventivas</h2>
          <button className="btn-view-all">Ver todas</button>
        </div>
        
        <div className="table-responsive">
          <table className="asset-table">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Equipamento</th>
                <th>Tipo</th>
                <th>Data Limite</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {maintenances.map((item) => (
                <tr key={item.id}>
                  <td className="fw-bold">{item.id}</td>
                  <td>{item.equipment}</td>
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
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

export default Dashboard;