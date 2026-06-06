import React, { useState, useEffect } from 'react';
import './Movimentacao.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-movim.png';

import detalhesIcon from '../assets/Detalhes Icon.png';
import editarIcon from '../assets/Editar Icon.png';
import excluirIcon from '../assets/Excluir Icon.png';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const calcularStatus = (mov) => {
  if (mov.status === 'CANCELADO') return 'cancelado';

  const hoje = new Date();
  const inicio = new Date(mov.data_inicio);
  const fim = new Date(mov.data_fim);
  const conclusao = mov.data_conclusao ? new Date(mov.data_conclusao) : null;

  if (conclusao && conclusao < hoje) return 'finalizado';
  if (fim < hoje) return 'atrasado';
  if (inicio <= hoje && fim >= hoje) return 'em-uso';
  if (inicio > hoje) return 'agendado';

  return 'agendado';
};

const statusMap = {
  'agendado': 'Agendado',
  'em-uso': 'Em Uso',
  'atrasado': 'Atrasado',
  'finalizado': 'Finalizado',
  'cancelado': 'Cancelado',
};

const getStatusClass = (status) => {
  return status.toLowerCase();
};

function Movimentacao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [manutencoes, setManutencoes]     = useState([]);
  const [equipamentos, setEquipamentos]   = useState([]);
  const [setores, setSetores]             = useState([]);
  const [usuarios, setUsuarios]           = useState([]);
  const [loading, setLoading]             = useState(true);

  const [viewMode, setViewMode]       = useState('tabela');
  const [activeModal, setActiveModal] = useState(null);

  const [searchTerm,       setSearchTerm]       = useState('');
  const [filterStatus,     setFilterStatus]     = useState('');
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim,    setFilterDataFim]    = useState('');
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  const emptyAlocacao = {
    idEquipamento: '', idSetor: '', idUsuario: '',
    dataInicio: '', dataConclusao: '', observacao: ''
  };
  const emptyMov = {
    idEquipamento: '', idSetorOrigem: '', idSetorDestino: '',
    dataInicio: '', dataConclusao: '', observacao: '', idMovimentacao: null, idUsuarioResponsavel: ''
  };

  const [formAlocacao,     setFormAlocacao]     = useState(emptyAlocacao);
  const [formMovimentacao, setFormMovimentacao] = useState(emptyMov);
  const [selectedMov,      setSelectedMov]      = useState(null);
  const [modalError, setModalError] = useState('');
  const [deleteError,      setDeleteError]      = useState('');

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resMov, resManu, resEq, resSet, resUsers] = await Promise.all([
        api.get('/movimentacoes'),
        api.get('/manutencoes'),
        api.get('/equipamentos'),
        api.get('/setores'),
        api.get('/usuarios'),
      ]);
      setMovimentacoes(resMov.data);
      setManutencoes(resManu.data);
      setEquipamentos(resEq.data);
      setSetores(resSet.data);
      setUsuarios(resUsers.data.filter(u => u.status?.toUpperCase() === 'ATIVO'));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipamentoChange = (idEquipamento) => {
    const eq = equipamentos.find(e => String(e.idEquipamento) === String(idEquipamento));
    setFormMovimentacao(prev => ({
      ...prev,
      idEquipamento,
      idSetorOrigem: eq?.idSetor || '',
    }));
  };

  const handleSaveAlocacao = async (e) => {
    e.preventDefault();
    try {
      setModalError('');

      const payload = {
        idEquipamento:        formAlocacao.idEquipamento,
        idSetorDestino:       formAlocacao.idSetor,
        idUsuarioResponsavel: formAlocacao.idUsuario || null,
        dataInicio:    formAlocacao.dataInicio    ? formAlocacao.dataInicio    + 'T00:00:00' : null,
        dataConclusao: formAlocacao.dataConclusao ? formAlocacao.dataConclusao + 'T00:00:00' : null,
        observacao:    formAlocacao.observacao    || null,
      };

      await api.post('/movimentacoes/transferir', payload);

      setActiveModal(null);
      carregarDados();
    } catch (error) {
      setModalError(error.response?.data?.message || 'Erro ao alocar ativo.');
    }
  };

    const handleDeleteMovimentacao = async () => {
    try {
      setDeleteError('');
      await api.delete(`/movimentacoes/${selectedMov.idMovimentacao}`);
      setActiveModal(null);
      setSelectedMov(null);
      carregarDados();
    } catch (error) {
      setDeleteError('Não foi possível excluir esta movimentação.');
    }
  };

  const handleSaveMovimentacao = async (e) => {
    e.preventDefault();
    try {
      setModalError('');

      const payload = {
        idEquipamento:        formMovimentacao.idEquipamento,
        idSetorOrigem:        formMovimentacao.idSetorOrigem  || null,
        idSetorDestino:       formMovimentacao.idSetorDestino,
        idUsuarioResponsavel: formMovimentacao.idUsuarioResponsavel || null,
        dataInicio:    formMovimentacao.dataInicio    ? formMovimentacao.dataInicio    + 'T00:00:00' : null,
        dataConclusao: formMovimentacao.dataConclusao ? formMovimentacao.dataConclusao + 'T00:00:00' : null,
        observacao:    formMovimentacao.observacao    || null,
      };

      if (activeModal === 'editar') {
        await api.put(`/movimentacoes/${formMovimentacao.idMovimentacao}`, payload);
      } else {
        await api.post('/movimentacoes/transferir', payload);
      }

      setActiveModal(null);
      carregarDados();
    } catch (error) {
      setModalError(error.response?.data?.message || 'Erro na operação.');
    }
  };

  const filteredMovimentacoes = movimentacoes.filter(mov => {
    const status = calcularStatus(mov);

    const matchesSearch =
        mov.equipamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mov.setorDestino?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? status === filterStatus : true;

    let matchesData = true;
    if (filterDataInicio || filterDataFim) {
      const movDate = mov.dataInicio ? new Date(mov.dataInicio) : new Date(mov.dataMovimentacao);
      movDate.setHours(0, 0, 0, 0);
      if (filterDataInicio) {
        const start = new Date(filterDataInicio + 'T00:00:00');
        if (movDate < start) matchesData = false;
      }
      if (filterDataFim) {
        const end = new Date(filterDataFim + 'T00:00:00');
        if (movDate > end) matchesData = false;
      }
    }

    return matchesSearch && matchesStatus && matchesData;
  });

  const getCalendarEvents = () => {
    const eventos = [];
    movimentacoes.forEach(mov => {
      if (mov.dataConclusao) {
        eventos.push({
          title: `Devolução: ${mov.equipamento}`,
          start: new Date(mov.dataConclusao),
          end:   new Date(mov.dataConclusao),
          type:  'ALOCACAO',
        });
      }
    });
    manutencoes.forEach(m => {
      if (!m.dataConclusao && m.dataInicio) {
        eventos.push({
          title: `🛠️ MNT: ${m.nomeEquipamento}`,
          start: new Date(m.dataInicio),
          end:   new Date(m.dataInicio),
          type:  'MANUTENCAO',
        });
      }
    });
    return eventos;
  };

  const formatDate = (val) => {
    if (!val) return '—';
    return new Date(val).toLocaleDateString('pt-BR');
  };

  const equipamentosAtivos = equipamentos.filter(eq => eq.statusAtual?.toUpperCase() === 'ATIVO');

  if (loading) return <div className="loading-state">Carregando painel...</div>;

  const messages = {
    today: 'Hoje',
    previous: 'Voltar',
    next: 'Avançar',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',

    date: 'Data',
    time: 'Hora',
    event: 'Evento',

    noEventsInRange: 'Nenhum evento neste período',
  };

  return (
      <div className="movimentacao-container">

        <header className="movimentacao-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <div>
              <h1>🔄 Gestão de Movimentação</h1>
              <p>Alocações, transferências de setores e agenda de manutenções.</p>
            </div>
            <div className="header-buttons">
              <button className="btn-primary" onClick={() => { setFormAlocacao(emptyAlocacao); setActiveModal('alocacao'); }}>
                + Nova Alocação
              </button>
              <button className="btn-primary" onClick={() => { setFormMovimentacao(emptyMov); setActiveModal('movimentacao'); }}>
                + Nova Movimentação
              </button>
            </div>
          </div>
        </header>

        <section className="metrics-grid">
          <div className="metric-card highlight">
            <div className="metric-icon">💻</div>
            <div className="metric-info">
              <h3>Em Uso</h3>
              <p className="metric-value">{movimentacoes.filter(m => calcularStatus(m) === 'Em Uso').length}</p>
            </div>
          </div>
          <div className="metric-card warning">
            <div className="metric-icon">⚠️</div>
            <div className="metric-info">
              <h3>Atrasados</h3>
              <p className="metric-value">{movimentacoes.filter(m => calcularStatus(m) === 'Atrasado').length}</p>
            </div>
          </div>
          <div className="metric-card dark-mode">
            <div className="metric-icon">📋</div>
            <div className="metric-info">
              <h3>Total de Registros</h3>
              <p className="metric-value">{movimentacoes.length}</p>
            </div>
          </div>
        </section>

        <div className="filters-container">
          <input
              type="text"
              placeholder="Buscar por equipamento ou destino..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="filter-input-search"
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">Todos os Status</option>
            <option value="Em Uso">Em Uso</option>
            <option value="Agendado">Agendado</option>
            <option value="Atrasado">Atrasado</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>De:</span>
            <input type="datetime-local" value={filterDataInicio} onChange={e => setFilterDataInicio(e.target.value)} className="filter-select" />
            <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Até:</span>
            <input type="datetime-local" value={filterDataFim} onChange={e => setFilterDataFim(e.target.value)} className="filter-select" />
          </div>
        </div>

        <section className="table-section">
          <div className="table-header">
            <h2>Painel Logístico</h2>
            <div className="view-toggle">
              <button className={`btn-toggle ${viewMode === 'tabela'     ? 'active' : ''}`} onClick={() => setViewMode('tabela')}>📑 Tabela</button>
              <button className={`btn-toggle ${viewMode === 'calendario' ? 'active' : ''}`} onClick={() => setViewMode('calendario')}>📅 Calendário</button>
            </div>
          </div>

          {viewMode === 'tabela' ? (
              <div className="table-responsive">
                <table className="custom-table zebrada">
                  <thead>
                  <tr>
                    <th style={{ textAlign: 'center', width: '5%' }}>ID</th>
                    <th style={{ textAlign: 'center', width: '25%' }}>Equipamento</th>
                    <th style={{ textAlign: 'center' }}>Origem</th>
                    <th style={{ textAlign: 'center' }}>Destino</th>
                    <th style={{ textAlign: 'center' }}>Data Início</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'center' }}>Ações</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredMovimentacoes.length > 0 ? (
                      filteredMovimentacoes.map((mov, index) => {
                        const status = calcularStatus(mov);
                        return (
                            <tr key={mov.idMovimentacao}>
                              <td style={{ textAlign: 'center' }}>{index + 1}</td>
                              <td
                                  className="fw-bold col-equipamento"
                                  style={{ textAlign: 'center' }}
                                  title={mov.equipamento}
                              >
                                {mov.equipamento}
                              </td>
                              <td style={{ textAlign: 'center' }}>{mov.setorOrigem || 'Estoque'}</td>
                              <td style={{ textAlign: 'center' }} className="text-success">{mov.setorDestino}</td>
                              <td style={{ textAlign: 'center' }}>{formatDate(mov.dataInicio || mov.dataMovimentacao)}</td>
                              <td style={{ textAlign: 'center' }}>
                          <span className={`status-badge ${getStatusClass(status)}`}>
                            {status}
                          </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                  <button className="btn-icon" title="Detalhes" onClick={() => { setSelectedMov(mov); setActiveModal('detalhes'); }}>
                                    <img src={detalhesIcon} alt="Detalhes" className="action-icon" />
                                  </button>
                                  <button className="btn-icon" title="Editar" onClick={() => {
                                    const equipamento = equipamentos.find(e => e.nomeEquipamento === mov.equipamento);
                                    const setorDestino = setores.find(s => s.nomeSetor === mov.setorDestino);
                                    const setorOrigem = setores.find(s => s.nomeSetor === mov.setorOrigem);

                                    setFormMovimentacao({
                                      idMovimentacao: mov.idMovimentacao,
                                      idEquipamento: equipamento?.idEquipamento || '',
                                      idSetorOrigem: setorOrigem?.idSetor || '',
                                      idSetorDestino: setorDestino?.idSetor || '',
                                      idUsuarioResponsavel: mov.idUsuarioResponsavel || '',
                                      dataInicio: mov.dataInicio ? mov.dataInicio.substring(0, 10) : '',
                                      dataConclusao: mov.dataConclusao ? mov.dataConclusao.substring(0, 10) : '',
                                      observacao: mov.observacao || '',
                                    });

                                    setActiveModal('editar');
                                  }}>
                                    <img src={editarIcon} alt="Editar" className="action-icon" />
                                  </button>
                                  <button className="btn-icon" title="Excluir" onClick={() => { setSelectedMov(mov); setDeleteError(''); setActiveModal('excluir'); }}>
                                    <img src={excluirIcon} alt="Excluir" className="action-icon" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                        );
                      })
                  ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                          Nenhuma movimentação encontrada.
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
          ) : (
              <div className="calendar-wrapper">
                <Calendar
                    localizer={localizer}
                    events={getCalendarEvents()}
                    style={{ height: 500 }}

                    date={date}
                    onNavigate={(newDate) => setDate(newDate)}

                    view={view}
                    onView={(newView) => setView(newView)}

                    culture="pt-BR"
                    messages={messages}
                    views={['month', 'week', 'day']}

                    eventPropGetter={(event) => ({
                      style: {
                        backgroundColor:
                            event.type === 'MANUTENCAO'
                                ? '#d35400'
                                : 'var(--color-primary)'
                      }
                    })}
                />
              </div>
          )}
        </section>

        {activeModal === 'alocacao' && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Nova Alocação</h2>
                  <button className="btn-close" onClick={() => setActiveModal(null)}>&times;</button>
                </div>
                <form onSubmit={handleSaveAlocacao} className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Equipamento</label>
                      <select
                          value={formAlocacao.idEquipamento}
                          onChange={e => setFormAlocacao({ ...formAlocacao, idEquipamento: e.target.value })}
                          required
                      >
                        <option value="">Selecione...</option>
                        {equipamentosAtivos.map(eq => (
                            <option key={eq.idEquipamento} value={eq.idEquipamento}>{eq.nomeEquipamento}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Setor Destino</label>
                      <select
                          value={formAlocacao.idSetor}
                          onChange={e => setFormAlocacao({ ...formAlocacao, idSetor: e.target.value })}
                          required
                      >
                        <option value="">Selecione...</option>
                        {setores.map(s => <option key={s.idSetor} value={s.idSetor}>{s.nomeSetor}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Usuário Responsável</label>
                    <select
                        value={formAlocacao.idUsuario}
                        onChange={e => setFormAlocacao({ ...formAlocacao, idUsuario: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Data Início</label>
                      <input type="datetime-local" value={formAlocacao.dataInicio} onChange={e => setFormAlocacao({ ...formAlocacao, dataInicio: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Data Conclusão (Devolução)</label>
                      <input type="datetime-local" value={formAlocacao.dataConclusao} onChange={e => setFormAlocacao({ ...formAlocacao, dataConclusao: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Observação</label>
                    <textarea value={formAlocacao.observacao} onChange={e => setFormAlocacao({ ...formAlocacao, observacao: e.target.value })} />
                  </div>
                  {modalError && (
                      <div style={{
                        marginTop: '15px',
                        padding: '12px 15px',
                        backgroundColor: '#fdecea',
                        color: '#c0392b',
                        borderRadius: '6px',
                        fontSize: '14px',
                        borderLeft: '4px solid #e74c3c'
                      }}>
                        <strong>Erro:</strong> {modalError}
                      </div>
                  )}
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancelar</button>
                    <button type="submit" className="btn-primary">Confirmar Alocação</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {(activeModal === 'movimentacao' || activeModal === 'editar') && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{activeModal === 'editar' ? 'Editar Movimentação' : 'Nova Movimentação'}</h2>
                  <button className="btn-close" onClick={() => setActiveModal(null)}>&times;</button>
                </div>
                <form onSubmit={handleSaveMovimentacao} className="modal-form">
                  <div className="form-group">
                    <label>Equipamento</label>
                    <select
                        value={formMovimentacao.idEquipamento}
                        onChange={e => handleEquipamentoChange(e.target.value)}
                        required
                        disabled={activeModal === 'editar'}
                    >
                      <option value="">Selecione...</option>
                      {equipamentosAtivos.map(eq => (
                          <option key={eq.idEquipamento} value={eq.idEquipamento}>{eq.nomeEquipamento}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Setor de Origem</label>
                      <select
                          value={formMovimentacao.idSetorOrigem}
                          onChange={e => setFormMovimentacao({ ...formMovimentacao, idSetorOrigem: e.target.value })}
                          required
                      >
                        <option value="">Selecione...</option>
                        {setores.map(s => <option key={s.idSetor} value={s.idSetor}>{s.nomeSetor}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Setor Destino</label>
                      <select
                          value={formMovimentacao.idSetorDestino}
                          onChange={e => setFormMovimentacao({ ...formMovimentacao, idSetorDestino: e.target.value })}
                          required
                      >
                        <option value="">Selecione...</option>
                        {setores.map(s => <option key={s.idSetor} value={s.idSetor}>{s.nomeSetor}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Responsável</label>
                      <select
                          value={formMovimentacao.idUsuarioResponsavel}
                          onChange={e =>
                              setFormMovimentacao({
                                ...formMovimentacao,
                                idUsuarioResponsavel: e.target.value
                              })
                          }
                      >
                        <option value="">Selecione...</option>
                        {usuarios.map(u => (
                            <option key={u.id} value={u.id}>{u.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Data Início</label>
                      <input type="datetime-local" value={formMovimentacao.dataInicio} onChange={e => setFormMovimentacao({ ...formMovimentacao, dataInicio: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Data Conclusão</label>
                      <input type="datetime-local" value={formMovimentacao.dataConclusao} onChange={e => setFormMovimentacao({ ...formMovimentacao, dataConclusao: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Observação</label>
                    <textarea value={formMovimentacao.observacao} onChange={e => setFormMovimentacao({ ...formMovimentacao, observacao: e.target.value })} />
                  </div>
                  {modalError && (
                      <div style={{
                        marginTop: '15px',
                        padding: '12px 15px',
                        backgroundColor: '#fdecea',
                        color: '#c0392b',
                        borderRadius: '6px',
                        fontSize: '14px',
                        borderLeft: '4px solid #e74c3c'
                      }}>
                        <strong>Erro:</strong> {modalError}
                      </div>
                  )}
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancelar</button>
                    <button type="submit" className="btn-primary">
                      {activeModal === 'editar' ? 'Salvar Alterações' : 'Confirmar Movimentação'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {activeModal === 'detalhes' && selectedMov && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Detalhes da Movimentação</h2>
                  <button className="btn-close" onClick={() => setActiveModal(null)}>&times;</button>
                </div>
                <div className="modal-form">
                  <div className="form-group">
                    <label>Equipamento</label>
                    <input type="text" value={selectedMov.equipamento || '—'} disabled />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Setor Origem</label>
                      <input type="text" value={selectedMov.setorOrigem || 'Estoque'} disabled />
                    </div>
                    <div className="form-group">
                      <label>Setor Destino</label>
                      <input type="text" value={selectedMov.setorDestino || '—'} disabled />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Responsável</label>
                    <input
                        type="text"
                        value={
                            usuarios.find(u => u.id === selectedMov.idUsuarioResponsavel)?.nome || '—'
                        }
                        disabled
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Data Início</label>
                      <input type="text" value={formatDate(selectedMov.dataInicio)} disabled />
                    </div>
                    <div className="form-group">
                      <label>Data Conclusão</label>
                      <input type="text" value={formatDate(selectedMov.dataConclusao)} disabled />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <input type="text" value={calcularStatus(selectedMov)} disabled />
                  </div>
                  <div className="form-group">
                    <label>Observação</label>
                    <textarea value={selectedMov.observacao || '—'} disabled />
                  </div>
                </div>
                <div className="modal-footer" style={{ marginTop: '20px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Fechar</button>
                </div>
              </div>
            </div>
        )}

        {activeModal === 'excluir' && selectedMov && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Confirmar Exclusão</h2>
                  <button className="btn-close" onClick={() => setActiveModal(null)}>&times;</button>
                </div>
                <div className="modal-form">
                  <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>
                    Tem certeza que deseja excluir a movimentação do equipamento{' '}
                    <strong>{selectedMov.equipamento}</strong>?
                  </p>
                  {deleteError ? (
                      <div style={{ marginTop: '15px', padding: '12px 15px', backgroundColor: '#fdecea', color: '#c0392b', borderRadius: '6px', fontSize: '14px', borderLeft: '4px solid #e74c3c' }}>
                        <strong>Ação Negada:</strong> {deleteError}
                      </div>
                  ) : (
                      <span style={{ color: '#c0392b', fontSize: '13px', display: 'block', marginTop: '10px' }}>
                  Atenção: Esta ação não pode ser desfeita.
                </span>
                  )}
                </div>
                <div className="modal-footer" style={{ padding: '20px 25px' }}>
                  <button className="btn-secondary" onClick={() => setActiveModal(null)}>Cancelar</button>
                  <button
                      className="btn-primary"
                      style={{ backgroundColor: '#e74c3c', color: 'white' }}
                      onClick={handleDeleteMovimentacao}
                  >
                    Excluir Movimentação
                  </button>
                </div>
              </div>
            </div>
        )}

      </div>
  );
}

export default Movimentacao;