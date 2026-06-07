import React from 'react';
import './Relatorios.css';
import imagemFundo from '../assets/fundo-relat.png';
function Relatorios() {

  const handleExport = (relatorio, formato) => {
    alert(`A processar...\nA gerar o ${relatorio} no formato ${formato}. Este ficheiro seria descarregado automaticamente.`);
  };

  return (
    <div className="relatorios-container">
      
      <header className="relatorios-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <div className="header-content">
          <div>
            <h1>📊 Central de Relatórios</h1>
            <p>Gere, exporte e analise os dados de equipamentos, manutenções e alocações.</p>
          </div>
        </div>
      </header>

      <section className="reports-grid">
        
        <div className="report-builder-card">
          <div className="report-header">
            <div className="report-icon">💻</div>
            <div>
              <h3>Relatório de Equipamentos</h3>
              <p>Relatório detalhado de todos os equipamentos cadastrados no sistema.</p>
            </div>
          </div>
          
          <div className="report-filters">
            <div className="filter-group">
              <label>Categoria</label>
              <select>
                <option value="todas">Todas as Categorias</option>
                <option value="informatica">Informática</option>
                <option value="infraestrutura">Infraestrutura</option>
                <option value="redes">Redes</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select>
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="manutencao">Em Manutenção</option>
                <option value="estoque">Em Estoque</option>
              </select>
            </div>
          </div>

          <div className="report-actions">
            <button className="btn-export pdf" onClick={() => handleExport('Relatório de Equipamentos', 'PDF')}>
              📄 Gerar PDF
            </button>
            <button className="btn-export excel" onClick={() => handleExport('Relatório de Equipamentos', 'Excel')}>
              📊 Exportar Excel
            </button>
          </div>
        </div>

        <div className="report-builder-card">
          <div className="report-header">
            <div className="report-icon">🛠️</div>
            <div>
              <h3>Histórico de Manutenções</h3>
              <p>Histórico completo de manutenções preventivas e corretivas.</p>
            </div>
          </div>
          
          <div className="report-filters">
            <div className="filter-group date-group">
              <label>Período (Início e Fim)</label>
              <div className="date-inputs">
                <input type="date" className="date-input" />
                <span>até</span>
                <input type="date" className="date-input" />
              </div>
            </div>
          </div>

          <div className="report-actions mt-auto">
            <button className="btn-export pdf" onClick={() => handleExport('Histórico de Manutenções', 'PDF')}>
              📄 Gerar PDF
            </button>
            <button className="btn-export excel" onClick={() => handleExport('Histórico de Manutenções', 'Excel')}>
              📊 Exportar Excel
            </button>
          </div>
        </div>

        <div className="report-builder-card">
          <div className="report-header">
            <div className="report-icon">🔄</div>
            <div>
              <h3>Movimentação e Reservas</h3>
              <p>Relatório de todas as movimentações de equipamentos entre setores.</p>
            </div>
          </div>
          
          <div className="report-filters">
            <div className="filter-group">
              <label>Setor</label>
              <select>
                <option value="todos">Todos os Setores</option>
                <option value="ti">TI / Data Center</option>
                <option value="atendimento">Atendimento</option>
                <option value="rh">Recursos Humanos</option>
              </select>
            </div>
            <div className="filter-group date-group">
              <label>Período (Início e Fim)</label>
              <div className="date-inputs">
                <input type="date" className="date-input" />
                <span>até</span>
                <input type="date" className="date-input" />
              </div>
            </div>
          </div>

          <div className="report-actions">
            <button className="btn-export pdf" onClick={() => handleExport('Relatório de Movimentação', 'PDF')}>
              📄 Gerar PDF
            </button>
            <button className="btn-export excel" onClick={() => handleExport('Relatório de Movimentação', 'Excel')}>
              📊 Exportar Excel
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}

export default Relatorios;