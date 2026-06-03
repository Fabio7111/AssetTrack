import React, { useState, useEffect } from 'react';
import './Auditoria.css';
import imagemFundo from '../assets/fundo-invent.png';

function Inventario() {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const mockInventario = [
          { patrimonio: 'UNI-ASSIS-1042', categoria: 'Infraestrutura', modelo: 'Servidor Oracle 19c', localizacao: 'Data Center principal', status: 'Ativo' },
          { patrimonio: 'UNI-ASSIS-1043', categoria: 'Informática', modelo: 'Notebook Dell XPS 13', localizacao: 'TI / Desenvolvimento', status: 'Em Manutenção' },
          { patrimonio: 'UNI-ASSIS-1044', categoria: 'Redes', modelo: 'Switch Cisco Catalyst', localizacao: 'Rack 02 - Andar 1', status: 'Ativo' },
          { patrimonio: 'UNI-ASSIS-1045', categoria: 'Informática', modelo: 'Monitor Dell 27"', localizacao: 'Almoxarifado', status: 'Em Estoque' },
          { patrimonio: 'UNI-ASSIS-1046', categoria: 'Redes', modelo: 'Extensor Wi-Fi TP-Link', localizacao: 'Atendimento', status: 'Baixa' }
        ];
        
        setInventario(mockInventario);
      } catch (error) {
        console.error("Erro ao buscar inventário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventario();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Carregando métricas do sistema...</div>;
  }

  return (
    <div className="inventario-container">
      
      <header className="inventario-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <div className="header-content">
          <div>
            <h1>📦 Inventário Geral</h1>
            <p>Controle centralizado de patrimônios e auditoria de ativos.</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary">+ Novo Equipamento</button>
            <button className="btn-auditoria">+ Nova Auditoria</button>
          </div>
        </div>
      </header>

      <section className="filters-card">
        <h3>Filtros Avançados</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Categoria</label>
            <select>
              <option value="">Todas as categorias...</option>
              <option value="informatica">Informática</option>
              <option value="redes">Redes</option>
              <option value="infraestrutura">Infraestrutura</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Localização</label>
            <select>
              <option value="">Todas as localizações...</option>
              <option value="almoxarifado">Almoxarifado</option>
              <option value="ti">Setor de TI</option>
              <option value="atendimento">Atendimento</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select>
              <option value="">Todos os status...</option>
              <option value="ativo">Ativo</option>
              <option value="estoque">Em Estoque</option>
              <option value="manutencao">Em Manutenção</option>
            </select>
          </div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-responsive">
          <table className="custom-table zebrada">
            <thead>
              <tr>
                <th>Patrimônio</th>
                <th>Categoria</th>
                <th>Modelo</th>
                <th>Localização Atual</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((item, index) => (
                <tr key={index}>
                  <td className="fw-bold">{item.patrimonio}</td>
                  <td>{item.categoria}</td>
                  <td>{item.modelo}</td>
                  <td>{item.localizacao}</td>
                  <td>
                    <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon edit" title="Editar">✏️</button>
                      <button className="btn-icon view" title="Detalhes">👁️</button>
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

export default Inventario;