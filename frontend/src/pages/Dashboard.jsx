import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-dashboard.png';

const getStatusManutencao = (m) => {
  if (m.status && m.status.toUpperCase() === 'CANCELADA') return 'Cancelada';
  if (m.dataConclusao) return 'Concluída';
  if (!m.dataInicio) return 'Aberta';
  const hoje = new Date();
  const inicio = new Date(m.dataInicio);
  if (inicio > hoje) return 'Pendente';
  return 'Em Andamento';
};

const statusClass = (s) => s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '-');

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalEquipamentos: 0,
    investimentoTotal: 0,
    pendentes: 0,
    baixoEstoque: 0,
  });
  const [manutencoes, setManutencoes] = useState([]);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try {
      const [resEq, resEstoque, resManu, resAquis] = await Promise.all([
        api.get('/equipamentos'),
        api.get('/estoque'),
        api.get('/manutencoes'),
        api.get('/aquisicoes').catch(() => ({ data: [] })),
      ]);

      const equipamentos = resEq.data || [];
      const estoque      = resEstoque.data || [];
      const manus        = resManu.data || [];
      const aquisicoes   = resAquis.data || [];

      const investimentoTotal = aquisicoes.reduce(
          (acc, a) => acc + (Number(a.valorTotal) || 0), 0
      );

      const baixoEstoque = estoque.filter(
          i => i.status === 'BAIXO_ESTOQUE' || i.status === 'ESGOTADO'
      ).length;

      const pendentes = manus.filter(m => {
        const st = getStatusManutencao(m);
        return st === 'Pendente' || st === 'Em Andamento' || st === 'Aberta';
      }).length;

      setMetrics({
        totalEquipamentos: equipamentos.length,
        investimentoTotal,
        pendentes,
        baixoEstoque,
      });

      const recentes = [...manus]
          .sort((a, b) => new Date(b.dataInicio || 0) - new Date(a.dataInicio || 0))
          .slice(0, 5);
      setManutencoes(recentes);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  const formatData = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—';

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
              <h3>Total de Equipamentos</h3>
              <p className="metric-value">{metrics.totalEquipamentos}</p>
            </div>
          </div>

          <div className="metric-card highlight">
            <div className="metric-icon">💰</div>
            <div className="metric-info">
              <h3>Investimento Total</h3>
              <p className="metric-value">{formatCurrency(metrics.investimentoTotal)}</p>
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-icon">🔧</div>
            <div className="metric-info">
              <h3>Manutenções Pendentes</h3>
              <p className="metric-value">{metrics.pendentes}</p>
            </div>
          </div>

          <div className="metric-card danger">
            <div className="metric-icon">⚠️</div>
            <div className="metric-info">
              <h3>Itens em Baixo Estoque</h3>
              <p className="metric-value">{metrics.baixoEstoque}</p>
            </div>
          </div>
        </section>

        <section className="dashboard-table-section">
          <div className="section-header">
            <h2>🔧 Manutenções Recentes</h2>
          </div>

          <div className="table-responsive">
            <table className="asset-table">
              <thead>
              <tr>
                <th>Equipamento</th>
                <th>Tipo</th>
                <th>Data Início</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              {manutencoes.length > 0 ? (
                  manutencoes.map((m) => {
                    const st = getStatusManutencao(m);
                    return (
                        <tr key={m.idManutencao}>
                          <td className="fw-bold">{m.nomeEquipamento}</td>
                          <td>{m.tipoManutencao}</td>
                          <td>{formatData(m.dataInicio)}</td>
                          <td><span className={`status-badge ${statusClass(st)}`}>{st}</span></td>
                        </tr>
                    );
                  })
              ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                      Nenhuma manutenção registrada.
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
  );
}

export default Dashboard;