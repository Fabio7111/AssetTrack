import React, { useState, useEffect } from 'react';
import './Movimentacao.css';
import imagemFundo from '../assets/fundo-movim.png';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'pt-BR': ptBR,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Movimentacao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('tabela'); // Controle: 'tabela' ou 'calendario'

  useEffect(() => {
    const fetchMovimentacoes = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const mockMovimentacoes = [
          { id: 1, equipamento: 'Laptop VAIO', patrimonio: 'UNI-ASSIS-1044', dtRet: '01/06/2026', devPrev: '30/06/2026', status: 'Em Uso', usuario: 'Aline' },
          { id: 2, equipamento: 'Monitor Dell 27"', patrimonio: 'UNI-ASSIS-1045', dtRet: '15/05/2026', devPrev: '--', status: 'Fixo', usuario: 'Natã' },
          { id: 3, equipamento: 'Extensor Wi-Fi TP-Link', patrimonio: 'UNI-ASSIS-1046', dtRet: '20/05/2026', devPrev: '25/05/2026', status: 'Atrasado', usuario: 'Fábio' },
          { id: 4, equipamento: 'Projetor Epson', patrimonio: 'UNI-ASSIS-1089', dtRet: '02/06/2026', devPrev: '03/06/2026', status: 'Em Uso', usuario: 'Diretoria' },
          { id: 5, equipamento: 'Nobreak APC 3KVA', patrimonio: 'UNI-ASSIS-1012', dtRet: '10/01/2026', devPrev: '--', status: 'Fixo', usuario: 'Infraestrutura' }
        ];
        
        setMovimentacoes(mockMovimentacoes);
      } catch (error) {
        console.error("Erro ao buscar movimentações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovimentacoes();
  }, []);

  const getCalendarEvents = () => {
    return movimentacoes
      .filter(mov => mov.devPrev !== '--')
      .map(mov => {
        const [dia, mes, ano] = mov.devPrev.split('/');
        const dataDevolucao = new Date(ano, mes - 1, dia); 
        
        return {
          id: mov.id,
          title: `Devolução: ${mov.equipamento} (${mov.usuario})`,
          start: dataDevolucao,
          end: dataDevolucao,
          allDay: true,
          status: mov.status
        };
      });
  };

  if (loading) {
    return <div className="loading-state">A carregar registos de alocação...</div>;
  }

  return (
    <div className="movimentacao-container">
      
      <header className="movimentacao-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <div className="header-content">
          <div>
            <h1>🔄 Alocação e Movimentação</h1>
            <p>Controle de empréstimos, devoluções e termos de responsabilidade.</p>
          </div>
          <button className="btn-primary">
            + Nova Alocação
          </button>
        </div>
      </header>

      <section className="metrics-grid">
        <div className="metric-card highlight">
          <div className="metric-icon">💻</div>
          <div className="metric-info">
            <h3>Equipamentos em Uso</h3>
            <p className="metric-value">45</p>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">⚠️</div>
          <div className="metric-info">
            <h3>Devoluções Atrasadas</h3>
            <p className="metric-value">03</p>
          </div>
        </div>

        <div className="metric-card dark-mode">
          <div className="metric-icon">📋</div>
          <div className="metric-info">
            <h3>Alocações no Mês</h3>
            <p className="metric-value">18</p>
          </div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>Controle de Alocações</h2>
          
          <div className="view-toggle">
            <button 
              className={`btn-toggle ${viewMode === 'tabela' ? 'active' : ''}`}
              onClick={() => setViewMode('tabela')}
            >
              📑 Tabela
            </button>
            <button 
              className={`btn-toggle ${viewMode === 'calendario' ? 'active' : ''}`}
              onClick={() => setViewMode('calendario')}
            >
              📅 Calendário
            </button>
          </div>
        </div>
        
        {viewMode === 'tabela' ? (
          /* --- VISÃO EM TABELA --- */
          <div className="table-responsive">
            <table className="custom-table zebrada">
              <thead>
                <tr>
                  <th>Equipamentos</th>
                  <th>Patrimônio</th>
                  <th>Dt Ret</th>
                  <th>Dev Prev</th>
                  <th>Status</th>
                  <th>Usuário</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((mov) => (
                  <tr key={mov.id}>
                    <td className="fw-bold">{mov.equipamento}</td>
                    <td>{mov.patrimonio}</td>
                    <td>{mov.dtRet}</td>
                    <td>{mov.devPrev}</td>
                    <td>
                      <span className={`status-badge ${mov.status.toLowerCase().replace(' ', '-')}`}>
                        {mov.status}
                      </span>
                    </td>
                    <td>{mov.usuario}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon edit" title="Editar">✏️</button>
                        <button className="btn-icon receive" title="Registrar Devolução">📥</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="calendar-wrapper">
            <Calendar
              localizer={localizer}
              events={getCalendarEvents()}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              culture="pt-BR"
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia"
              }}
              eventPropGetter={(event) => {
                let backgroundColor = '#27ae60'; // Verde padrão
                if (event.status === 'Atrasado') backgroundColor = '#e74c3c'; // Vermelho se estiver atrasado
                return { style: { backgroundColor, border: 'none', borderRadius: '4px' } };
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Movimentacao;