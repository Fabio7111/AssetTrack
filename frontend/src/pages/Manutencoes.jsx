import React, { useState, useEffect } from 'react';
import './Manutencoes.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-manu.png';
import detalhesIcon from '../assets/Detalhes Icon.png';
import editarIcon from '../assets/Editar Icon.png';
import excluirIcon from '../assets/Excluir Icon.png';

function Manutencoes() {
  const [manutencoes, setManutencoes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedManutencao, setSelectedManutencao] = useState(null);
  const [editingManutencao, setEditingManutencao] = useState(null);

  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // NOVO: Filtro de Status
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');

  const [formData, setFormData] = useState({
    idEquipamento: '', idTecnico: '', tipoManutencao: '',
    dataInicio: '', dataConclusao: '', descricaoServico: '', custoManutencao: ''
  });

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      setLoading(true);
      const [resManu, resEq, resUsers] = await Promise.all([
        api.get('/manutencoes'),
        api.get('/equipamentos'),
        api.get('/usuarios')
      ]);

      setManutencoes(resManu.data);

      const equipamentosAtivos = resEq.data.filter(eq =>
          eq.statusAtual && eq.statusAtual.toUpperCase() === 'ATIVO'
      );
      setEquipamentos(equipamentosAtivos);

      const tecnicosAtivos = resUsers.data.filter(u => {
        const perfil = (u.perfil || u.nomePerfil || u.perfilAcesso?.nomePerfil || '').toUpperCase();
        const isTech = perfil === 'MODERADOR' || perfil === 'ADMINISTRADOR';
        const isAtivo = u.status === 'ATIVO' || u.status === true;
        return isTech && isAtivo;
      });

      setTecnicos(tecnicosAtivos);

    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManutencoes = async () => {
    try {
      const response = await api.get('/manutencoes');
      setManutencoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar manutenções:", error);
    }
  };

  // === LÓGICA DE STATUS REVISADA ===
  const getStatus = (m) => {
    // 1. A prioridade máxima é verificar se foi cancelada no backend
    if (m.status && m.status.toUpperCase() === 'CANCELADA') return 'Cancelada';

    // 2. Se tem data de conclusão, está concluída
    if (m.dataConclusao) return 'Concluída';

    // 3. Se não tem data de início, está aguardando (Aberta)
    if (!m.dataInicio) return 'Aberta';

    // 4. Lógica de tempo para Em Andamento vs Pendente
    const hoje = new Date();
    const inicio = new Date(m.dataInicio);
    if (inicio > hoje) return 'Pendente';

    return 'Em Andamento';
  };

  const getSla = (m) => {
    const statusAtual = getStatus(m);
    if (statusAtual === 'Cancelada') return '-';
    if (!m.dataInicio) return 'N/A';

    const inicio = new Date(m.dataInicio);
    inicio.setHours(0, 0, 0, 0);

    let fim = new Date();
    if (m.dataConclusao) {
      fim = new Date(m.dataConclusao);
    }
    fim.setHours(0, 0, 0, 0);

    const diffTime = fim - inicio;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Em espera';
    if (diffDays === 0) return 'Mesmo dia';
    return `${diffDays} dia(s)`;
  };

  const getStatusClass = (statusString) => {
    return statusString.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(" ", "-");
  };

  const formatDatetimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const handleOpenModal = (m = null) => {
    if (m) {
      setEditingManutencao(m);
      setFormData({
        idEquipamento: m.idEquipamento || '',
        idTecnico: m.idTecnico || '',
        tipoManutencao: m.tipoManutencao || '',
        dataInicio: formatDatetimeLocal(m.dataInicio),
        dataConclusao: formatDatetimeLocal(m.dataConclusao),
        descricaoServico: m.descricaoServico || '',
        custoManutencao: m.custoManutencao || ''
      });
    } else {
      setEditingManutencao(null);
      setFormData({ idEquipamento: '', idTecnico: '', tipoManutencao: '', dataInicio: '', dataConclusao: '', descricaoServico: '', custoManutencao: '' });
    }
    setIsModalOpen(true);
  };

  // Sem Pop-ups! Fechamento silencioso e rápido.
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.custoManutencao) payload.custoManutencao = 0.00;
      if (!payload.dataInicio) payload.dataInicio = null;
      if (!payload.dataConclusao) payload.dataConclusao = null;

      if (editingManutencao) {
        await api.put(`/manutencoes/${editingManutencao.idManutencao}`, payload);
      } else {
        await api.post('/manutencoes', payload);
      }

      setIsModalOpen(false);
      fetchManutencoes();
    } catch (error) {
      alert("Erro ao salvar: " + (error.response?.data?.message || "Verifique os dados e tente novamente."));
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/manutencoes/${selectedManutencao.idManutencao}`);
      setDeleteModalOpen(false);
      fetchManutencoes(); // A tabela atualiza silenciosamente mostrando "Cancelada"
    } catch (error) {
      alert("Erro ao cancelar a manutenção.");
    }
  };

  const filteredManutencoes = manutencoes.filter(m => {
    const matchesSearch = m.nomeEquipamento?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo ? m.tipoManutencao === filterTipo : true;

    // NOVO: Aplicação do Filtro de Status
    const statusAtual = getStatus(m);
    const matchesStatus = filterStatus ? statusAtual.toUpperCase() === filterStatus.toUpperCase() : true;

    let matchesData = true;
    if (filterDataInicio || filterDataFim) {
      if (!m.dataInicio) return false;
      const dataInicio = new Date(m.dataInicio);
      if (filterDataInicio && dataInicio < new Date(filterDataInicio)) matchesData = false;
      if (filterDataFim && dataInicio > new Date(filterDataFim)) matchesData = false;
    }
    return matchesSearch && matchesTipo && matchesStatus && matchesData;
  });

  const exportToExcel = () => {
    const headers = ['ID', 'Equipamento', 'Tipo', 'Data Início', 'SLA', 'Status'];
    const csvRows = filteredManutencoes.map((m, index) => [
      index + 1, m.nomeEquipamento, m.tipoManutencao,
      m.dataInicio ? new Date(m.dataInicio).toLocaleDateString('pt-BR') : 'Não Iniciado',
      getSla(m), getStatus(m)
    ].map(v => `"${v}"`).join(','));
    const csvContent = "\uFEFF" + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_manutencoes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="dashboard-loading">Carregando...</div>;

  return (
      <div className="manutencoes-container">
        <header className="manutencoes-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <div>
              <h1>🛠️ Registro de Manutenções</h1>
              <p>Histórico de reparos e preventivas realizadas.</p>
            </div>
            <button className="btn-primary" onClick={() => handleOpenModal(null)}>+ Nova Manutenção</button>
          </div>
        </header>

        <section className="metrics-grid">
          <div className="metric-card warning">
            <div className="metric-icon">🔧</div>
            <div className="metric-info">
              <h3>Em Andamento</h3>
              <p className="metric-value">
                {manutencoes.filter(m => getStatus(m) === 'Em Andamento').length}
              </p>
            </div>
          </div>
          <div className="metric-card highlight">
            <div className="metric-icon">📅</div>
            <div className="metric-info">
              <h3>Preventivas (Total)</h3>
              <p className="metric-value">
                {manutencoes.filter(m => m.tipoManutencao === 'PREVENTIVA').length}
              </p>
            </div>
          </div>
          <div className="metric-card dark-mode">
            <div className="metric-icon">⏱️</div>
            <div className="metric-info">
              <h3>Total de Registros</h3>
              <p className="metric-value">{manutencoes.length}</p>
            </div>
          </div>
        </section>

        <div className="filters-container">
          <input type="text" placeholder="Buscar por equipamento..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="filter-input-search" style={{ minWidth: '250px' }} />

          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="filter-select">
            <option value="">Todos os Tipos</option>
            <option value="PREVENTIVA">Preventiva</option>
            <option value="CORRETIVA">Corretiva</option>
          </select>

          {/* NOVO: Filtro de Status */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">Todos os Status</option>
            <option value="Aberta">Aberta</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Pendente">Pendente</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
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
            <h2>Histórico de Serviços</h2>
            <button className="btn-secondary" onClick={exportToExcel}>Exportar para Excel</button>
          </div>

          <table className="custom-table zebrada">
            <thead>
            <tr>
              <th style={{ textAlign: 'center', width: '5%' }}>ID</th>
              <th style={{ textAlign: 'center', width: '30%', maxWidth: '200px' }}>Equipamentos</th>
              <th style={{ textAlign: 'center', width: '12%' }}>Tipo</th>
              <th style={{ textAlign: 'center', width: '12%' }}>Dt Início</th>
              <th>SLA</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            {filteredManutencoes.length > 0 ? (
                filteredManutencoes.map((m, index) => {
                  const statusText = getStatus(m);
                  const statusClass = getStatusClass(statusText);

                  return (
                      <tr key={m.idManutencao}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }} className="fw-bold">{m.nomeEquipamento}</td>
                        <td style={{ textAlign: 'center' }}>{m.tipoManutencao}</td>
                        <td style={{ textAlign: 'center' }}>{m.dataInicio ? new Date(m.dataInicio).toLocaleDateString('pt-BR') : '-'}</td>
                        <td>{getSla(m)}</td>
                        <td>
                          <span className={`status-badge ${statusClass}`}>
                              {statusText}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <button className="btn-icon" onClick={() => { setSelectedManutencao(m); setViewModalOpen(true); }} title="Detalhes"><img src={detalhesIcon} alt="Detalhes" /></button>
                          {statusText !== 'Cancelada' && (
                              <>
                                <button className="btn-icon" onClick={() => handleOpenModal(m)} title="Editar"><img src={editarIcon} alt="Editar" /></button>
                                <button className="btn-icon" onClick={() => { setSelectedManutencao(m); setDeleteModalOpen(true); }} title="Cancelar"><img src={excluirIcon} alt="Excluir" /></button>
                              </>
                          )}
                        </td>
                      </tr>
                  )})
            ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    Nenhuma manutenção encontrada.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </section>

        {/* MODAL DE CADASTRO / EDIÇÃO */}
        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{editingManutencao ? 'Editar Manutenção' : 'Registrar Nova Manutenção'}</h2>
                  <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                </div>
                <form onSubmit={handleSave} className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Equipamento</label>
                      <select value={formData.idEquipamento} onChange={e => setFormData({...formData, idEquipamento: e.target.value})} required>
                        <option value="">Selecione o Equipamento</option>
                        {equipamentos.map(eq => <option key={eq.idEquipamento || eq.id} value={eq.idEquipamento || eq.id}>{eq.nomeEquipamento}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Técnico Responsável</label>
                      <select value={formData.idTecnico} onChange={e => setFormData({...formData, idTecnico: e.target.value})} required>
                        <option value="">Selecione o Técnico</option>
                        {tecnicos.map(tec => <option key={tec.id} value={tec.id}>{tec.nome}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Data de Início (Deixe vazio p/ Aberto)</label>
                      <input type="datetime-local" value={formData.dataInicio} onChange={e => setFormData({...formData, dataInicio: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Data de Conclusão</label>
                      <input type="datetime-local" value={formData.dataConclusao} onChange={e => setFormData({...formData, dataConclusao: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo de Manutenção</label>
                      <select value={formData.tipoManutencao} onChange={e => setFormData({...formData, tipoManutencao: e.target.value})} required>
                        <option value="">Selecione a Manutenção</option>
                        <option value="PREVENTIVA">Preventiva</option>
                        <option value="CORRETIVA">Corretiva</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Custo do Serviço (R$)</label>
                      <input type="number" step="0.01" min="0" placeholder="Ex: 150.00" value={formData.custoManutencao} onChange={e => setFormData({...formData, custoManutencao: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Descrição do Serviço / Observações</label>
                    <textarea placeholder="Descreva os reparos realizados..." value={formData.descricaoServico} onChange={e => setFormData({...formData, descricaoServico: e.target.value})}></textarea>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    <button type="submit" className="btn-primary">{editingManutencao ? 'Salvar Alterações' : 'Salvar Serviço'}</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* MODAL DE DETALHES */}
        {viewModalOpen && selectedManutencao && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Detalhes da Manutenção</h2>
                  <button className="btn-close" onClick={() => setViewModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <div className="form-group">
                    <label>ID Original (Sistêmico)</label>
                    <input type="text" value={selectedManutencao.idManutencao} disabled />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Equipamento</label>
                      <input type="text" value={selectedManutencao.nomeEquipamento} disabled />
                    </div>
                    <div className="form-group">
                      <label>Técnico</label>
                      <input type="text" value={selectedManutencao.nomeTecnico} disabled />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo de Manutenção</label>
                      <input type="text" value={selectedManutencao.tipoManutencao} disabled />
                    </div>
                    <div className="form-group">
                      <label>Status Atual</label>
                      <input type="text" value={getStatus(selectedManutencao)} disabled />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Data de Início</label>
                      <input type="text" value={selectedManutencao.dataInicio ? new Date(selectedManutencao.dataInicio).toLocaleString('pt-BR') : 'Sem Previsão'} disabled />
                    </div>
                    <div className="form-group">
                      <label>Data de Conclusão</label>
                      <input type="text" value={selectedManutencao.dataConclusao ? new Date(selectedManutencao.dataConclusao).toLocaleString('pt-BR') : 'Em Aberto'} disabled />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>SLA (Tempo de Resolução)</label>
                      <input type="text" value={getSla(selectedManutencao)} disabled />
                    </div>
                    <div className="form-group">
                      <label>Custo Registrado</label>
                      <input type="text" value={`R$ ${selectedManutencao.custoManutencao?.toFixed(2) || '0.00'}`} disabled />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Descrição do Serviço</label>
                    <textarea value={selectedManutencao.descricaoServico || 'Sem descrição detalhada.'} disabled></textarea>
                  </div>
                </div>
                <div className="modal-footer" style={{ marginTop: '20px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setViewModalOpen(false)}>Fechar</button>
                </div>
              </div>
            </div>
        )}

        {/* MODAL DE CANCELAMENTO */}
        {deleteModalOpen && selectedManutencao && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Cancelar Manutenção</h2>
                  <button className="btn-close" onClick={() => setDeleteModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>
                    Tem certeza que deseja cancelar a manutenção do equipamento <strong>{selectedManutencao.nomeEquipamento}</strong>?
                  </p>
                  <span style={{color: '#c0392b', fontSize: '13px', display: 'block', marginTop: '10px'}}>
                    Atenção: O registro não será apagado, será mantido no histórico com o status "Cancelada".
                  </span>
                </div>
                <div className="modal-footer" style={{ padding: '20px 0 0 0' }}>
                  <button className="btn-secondary" onClick={() => setDeleteModalOpen(false)}>Desistir</button>
                  <button className="btn-primary" style={{ backgroundColor: '#e74c3c', color: 'white' }} onClick={handleDelete}>Confirmar Cancelamento</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default Manutencoes;