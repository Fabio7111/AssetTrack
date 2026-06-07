import React, { useState, useEffect } from 'react';
import './Equipamentos.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-equipam.png';

import detalhesIcon from '../assets/Detalhes Icon.png';
import editarIcon from '../assets/Editar Icon.png';
import excluirIcon from '../assets/Excluir Icon.png';

function Equipamentos() {
  const [equipments, setEquipments] = useState([]);
  const [setores, setSetores] = useState([]);
  const [aquisicoes, setAquisicoes] = useState([]);
  const [termosDoEquipamento, setTermosDoEquipamento] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [idUsuarioTermo, setIdUsuarioTermo] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSetor, setFilterSetor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [editingEq, setEditingEq] = useState(null);
  const [selectedEq, setSelectedEq] = useState(null);

  const [deleteError, setDeleteError] = useState('');

  const [formData, setFormData] = useState({
    nomeEquipamento: '',
    numeroSerie: '',
    idSetor: '',
    idAquisicao: ''
  });

  useEffect(() => {
    fetchEquipments();
    fetchSetores();
    fetchAquisicoes();
    fetchUsuarios();
  }, []);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/equipamentos');
      setEquipments(response.data);
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSetores = async () => {
    try {
      const response = await api.get('/setores');
      setSetores(response.data);
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
    }
  };

  const fetchAquisicoes = async () => {
    try {
      const response = await api.get('/aquisicoes');
      setAquisicoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar aquisições:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');

      const usuariosAtivos = response.data.filter(u =>
          u.status === 'ATIVO' || u.status === true || u.statusAtual === 'ATIVO'
      );

      setUsuarios(usuariosAtivos);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const filteredEquipments = equipments.filter(eq => {
    const matchesSearch = eq.nomeEquipamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (eq.numeroSerie && eq.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSetor = filterSetor ? eq.nomeSetor === filterSetor : true;

    const normalizedEqStatus = eq.statusAtual
        ? eq.statusAtual.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_')
        : '';
    const matchesStatus = filterStatus ? normalizedEqStatus === filterStatus : true;

    let matchesData = true;
    if (filterDataInicio || filterDataFim) {
      const eqDate = new Date(eq.dataCadastro);
      eqDate.setHours(0, 0, 0, 0);

      if (filterDataInicio) {
        const startDate = new Date(filterDataInicio + 'T00:00:00');
        if (eqDate < startDate) matchesData = false;
      }
      if (filterDataFim) {
        const endDate = new Date(filterDataFim + 'T00:00:00');
        if (eqDate > endDate) matchesData = false;
      }
    }

    return matchesSearch && matchesSetor && matchesStatus && matchesData;
  });

  const exportToExcel = () => {
    const headers = ['Equipamento', 'Número de Série', 'Setor/Local', 'Data de Cadastro', 'Status'];

    const csvRows = filteredEquipments.map(eq => [
      eq.nomeEquipamento,
      eq.numeroSerie || 'N/A',
      eq.nomeSetor,
      new Date(eq.dataCadastro).toLocaleDateString('pt-BR'),
      eq.statusAtual
    ].map(val => `"${val}"`).join(','));

    const csvContent = "\uFEFF" + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_equipamentos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenModal = (eq = null) => {
    const isEdit = eq && eq.idEquipamento;
    setEditingEq(isEdit ? eq : null);

    let idSetorEncontrado = '';
    if (isEdit && setores.length > 0) {
      const setorMatch = setores.find(s => s.nomeSetor === eq.nomeSetor);
      if (setorMatch) idSetorEncontrado = setorMatch.idSetor || setorMatch.id;
    }

    setFormData(isEdit ?
        {
          nomeEquipamento: eq.nomeEquipamento || '',
          numeroSerie: eq.numeroSerie || '',
          idSetor: idSetorEncontrado,
          idAquisicao: eq.idAquisicao || ''
        } :
        { nomeEquipamento: '', numeroSerie: '', idSetor: '', idAquisicao: '' }
    );

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEq(null);
    setFormData({ nomeEquipamento: '', numeroSerie: '', idSetor: '', idAquisicao: '' });
  };

  const openViewModal = (eq) => {
    setSelectedEq(eq);
    setViewModalOpen(true);
  };

  const openDeleteModal = (eq) => {
    setSelectedEq(eq);
    setDeleteError('');
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteError('');
  };

  const handleSaveEq = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };

      if (!payload.idAquisicao) delete payload.idAquisicao;

      if (editingEq) {
        await api.put(`/equipamentos/${editingEq.idEquipamento}`, payload);
      } else {
        await api.post('/equipamentos', payload);
      }
      handleCloseModal();
      fetchEquipments();
    } catch (error) {
      alert("Erro ao salvar equipamento: " + (error.response?.data?.message || "Verifique os dados."));
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteError('');
      await api.delete(`/equipamentos/${selectedEq.idEquipamento}`);
      fetchEquipments();
      setDeleteModalOpen(false);
      setSelectedEq(null);
    } catch (error) {
      setDeleteError(error.response?.data?.message || "Erro ao inativar/excluir equipamento. Pode estar vinculado a manutenções ou auditorias.");
    }
  };

  const handleOpenViewModal = async (eq) => {
    setSelectedEq(eq);
    setIdUsuarioTermo('');
    setViewModalOpen(true);
    try {
      const response = await api.get(`/termos/equipamento/${eq.idEquipamento}`);
      setTermosDoEquipamento(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico de termos:", error);
      setTermosDoEquipamento([]);
    }
  };

  const handleEmitirTermo = async (e) => {
    e.preventDefault();
    if (!idUsuarioTermo) return alert("Selecione um usuário para receber o ativo.");

    try {
      const payload = {
        idEquipamento: selectedEq.idEquipamento,
        idUsuario: idUsuarioTermo
      };

      await api.post('/termos', payload);
      alert("Termo de Responsabilidade emitido com sucesso!");
      setIdUsuarioTermo('');

      const response = await api.get(`/termos/equipamento/${selectedEq.idEquipamento}`);
      setTermosDoEquipamento(response.data);
    } catch (error) {
      alert("Erro ao emitir termo: " + (error.response?.data?.message || "Verifique as dependências."));
    }
  };

  const handleBaixarPdf = async (idTermo) => {
    try {
      const response = await api.get(`/termos/${idTermo}/pdf`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Termo_Responsabilidade_${idTermo.substring(0,8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Erro ao efetuar o download do PDF.");
    }
  };

  const getStatusInfo = (status) => {
    const normalizedStatus = status
        ? status.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_')
        : '';

    switch (normalizedStatus) {
      case 'ATIVO':
        return { label: 'Ativo', className: 'ativo' };
      case 'INATIVO':
        return { label: 'Inativo', className: 'inativo' };
      case 'EM_MANUTENCAO':
        return { label: 'Em Manutenção', className: 'em-manutencao' };
      default:
        return { label: status, className: status?.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-') };
    }
  };

  if (loading) return <div className="dashboard-loading">Carregando métricas do sistema...</div>;

  const getAquisicaoText = (idAq) => {
    if (!idAq) return 'Nenhuma / Não vinculada';
    const aq = aquisicoes.find(a => (a.idAquisicao || a.id) === idAq);
    return aq ? `NF: ${aq.numeroNotaFiscal || 'S/N'} - ${aq.fornecedor}` : 'Desconhecida';
  };

  return (
      <div className="equipamentos-container">

        <header className="equipamentos-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <div>
              <h1>💻 Gestão de Equipamentos e Ativos</h1>
              <p>Espaço reservado para a listagem e cadastro de ativos.</p>
            </div>
            <button className="btn-primary" onClick={() => handleOpenModal(null)}>
              + Novo Ativo
            </button>
          </div>
        </header>

        <section className="metrics-grid">
          <div className="metric-card highlight">
            <div className="metric-icon">🏢</div>
            <div className="metric-info">
              <h3>Total de Equipamentos</h3>
              <p className="metric-value">{equipments.length}</p>
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-icon">🔧</div>
            <div className="metric-info">
              <h3>Em Manutenção</h3>
              <p className="metric-value">
                {equipments.filter(e => e.statusAtual === 'EM_MANUTENCAO').length}
              </p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📦</div>
            <div className="metric-info">
              <h3>Ativos Desativados</h3>
              <p className="metric-value">
                {equipments.filter(e => e.statusAtual === 'INATIVO').length}
              </p>
            </div>
          </div>
        </section>

        <div className="filters-container" style={{ flexWrap: 'wrap' }}>
          <input
              type="text"
              placeholder="Buscar por equipamento ou Nº série..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="filter-input-search"
              style={{ minWidth: '250px' }}
          />
          <select value={filterSetor} onChange={e => setFilterSetor(e.target.value)} className="filter-select">
            <option value="">Todos os Setores</option>
            {setores.map(s => (
                <option key={s.idSetor || s.id} value={s.nomeSetor}>{s.nomeSetor}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">Todos os Status</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
            <option value="EM_MANUTENCAO">Em Manutenção</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>De:</span>
            <input
                type="datetime-local"
                value={filterDataInicio}
                onChange={e => setFilterDataInicio(e.target.value)}
                className="filter-select"
                title="Data Inicial"
            />
            <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Até:</span>
            <input
                type="datetime-local"
                value={filterDataFim}
                onChange={e => setFilterDataFim(e.target.value)}
                className="filter-select"
                title="Data Final"
            />
          </div>
        </div>

        <section className="table-section">
          <div className="table-header">
            <h2>Detalhamento de Ativos</h2>
            <button className="btn-secondary" onClick={exportToExcel}>Exportar para Excel</button>
          </div>

          <div className="table-responsive">
            <table className="custom-table zebrada">
              <thead>
              <tr>
                <th>Equipamento</th>
                <th>Número de Série</th>
                <th>Setor/Local</th>
                <th>Data de Cadastro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
              </thead>
              <tbody>
              {filteredEquipments.length > 0 ? (
                  filteredEquipments.map((eq) => (
                      <tr key={eq.idEquipamento}>
                        <td className="fw-bold">{eq.nomeEquipamento}</td>
                        <td>{eq.numeroSerie || '-'}</td>
                        <td>{eq.nomeSetor}</td>
                        <td>{new Date(eq.dataCadastro).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <span className={`status-badge ${getStatusInfo(eq.statusAtual).className}`}>
                            {getStatusInfo(eq.statusAtual).label}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon" onClick={() => handleOpenViewModal(eq)} title="Detalhes">
                              <img src={detalhesIcon} alt="Detalhes" className="action-icon" />
                            </button>
                            <button className="btn-icon" onClick={() => handleOpenModal(eq)} title="Editar">
                              <img src={editarIcon} alt="Editar" className="action-icon" />
                            </button>
                            <button className="btn-icon" onClick={() => openDeleteModal(eq)} title="Excluir">
                              <img src={excluirIcon} alt="Excluir" className="action-icon" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                      Nenhum equipamento encontrado com estes filtros.
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </section>

        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{editingEq ? 'Editar Equipamento' : 'Novo Equipamento'}</h2>
                  <button className="btn-close" onClick={handleCloseModal}>&times;</button>
                </div>

                <form className="modal-form" onSubmit={handleSaveEq}>
                  <div className="form-group">
                    <label>Nome do Equipamento (Modelo)</label>
                    <input
                        type="text"
                        value={formData.nomeEquipamento}
                        onChange={e => setFormData({...formData, nomeEquipamento: e.target.value})}
                        required
                        autoComplete="off"
                    />
                  </div>

                  <div className="form-group">
                    <label>Número de Série / Patrimônio</label>
                    <input
                        type="text"
                        value={formData.numeroSerie}
                        onChange={e => setFormData({...formData, numeroSerie: e.target.value})}
                        autoComplete="off"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Setor</label>
                      <select value={formData.idSetor} onChange={e => setFormData({...formData, idSetor: e.target.value})} required>
                        <option value="">Selecione o Setor</option>
                        {setores.map(s => (
                            <option key={s.idSetor || s.id} value={s.idSetor || s.id}>{s.nomeSetor}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Aquisição (Opcional)</label>
                      <select value={formData.idAquisicao} onChange={e => setFormData({...formData, idAquisicao: e.target.value})}>
                        <option value="">Nenhuma / Não registada</option>
                        {aquisicoes.map(a => (
                            <option key={a.idAquisicao || a.id} value={a.idAquisicao || a.id}>
                              NF: {a.numeroNotaFiscal} - {a.fornecedor}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                    <button type="submit" className="btn-primary">Salvar Equipamento</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {viewModalOpen && selectedEq && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '750px', width: '90%' }}>
                <div className="modal-header">
                  <h2>Detalhes e Documentação do Ativo</h2>
                  <button className="btn-close" onClick={() => setViewModalOpen(false)}>&times;</button>
                </div>

                <div className="modal-body-scroll" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '5px' }}>
                  <div className="modal-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>ID do Equipamento</label>
                        <input type="text" value={selectedEq.idEquipamento} disabled />
                      </div>
                      <div className="form-group">
                        <label>Data de Cadastro</label>
                        <input type="text" value={new Date(selectedEq.dataCadastro).toLocaleDateString('pt-BR')} disabled />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Nome / Modelo</label>
                      <input type="text" value={selectedEq.nomeEquipamento} disabled />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Série / Patrimônio</label>
                        <input type="text" value={selectedEq.numeroSerie || 'Não Registrado'} disabled />
                      </div>
                      <div className="form-group">
                        <label>Setor Atual</label>
                        <input type="text" value={selectedEq.nomeSetor} disabled />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Aquisição Vinculada</label>
                        <input type="text" value={getAquisicaoText(selectedEq.idAquisicao)} disabled />
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <input type="text" value={getStatusInfo(selectedEq.statusAtual).label} disabled />
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '25px 0' }} />

                  <div className="termo-section">
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📋 Histórico e Emissão de Termos de Responsabilidade
                    </h3>

                    <form onSubmit={handleEmitirTermo} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f0f0f0' }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label style={{ fontSize: '12px', fontWeight: '600' }}>Vincular Posse / Emitir Novo Termo para:</label>
                        <select
                            value={idUsuarioTermo}
                            onChange={e => setIdUsuarioTermo(e.target.value)}
                            style={{ width: '100%', marginTop: '5px', padding: '8px' }}
                        >
                          <option value="">Selecione o Colaborador Recebedor</option>
                          {usuarios.map(u => (
                              <option key={u.id} value={u.id}>{u.nome} ({u.perfil || 'Usuário'})</option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="btn-primary" style={{ height: '38px', padding: '0 20px', whiteSpace: 'nowrap', fontSize: '13px' }}>
                        Gerar Termo
                      </button>
                    </form>

                    <div className="table-responsive" style={{ boxShadow: 'none', border: '1px solid #eee', borderRadius: '6px' }}>
                      <table className="custom-table" style={{ fontSize: '13px' }}>
                        <thead style={{ background: '#f5f5f5' }}>
                        <tr>
                          <th style={{ padding: '10px', background: '#7f8c8d', fontSize: '11px' }}>Usuário Responsável</th>
                          <th style={{ padding: '10px', background: '#7f8c8d', fontSize: '11px' }}>Emissão</th>
                          <th style={{ padding: '10px', background: '#7f8c8d', fontSize: '11px' }}>Situação</th>
                          <th style={{ padding: '10px', background: '#7f8c8d', fontSize: '11px' }}>Ação</th>
                        </tr>
                        </thead>
                        <tbody>
                        {termosDoEquipamento.length > 0 ? (
                            termosDoEquipamento.map((t) => (
                                <tr key={t.idTermo}>
                                  <td style={{ padding: '10px', fontWeight: '500' }}>{t.nomeUsuario}</td>
                                  <td style={{ padding: '10px' }}>{new Date(t.dataEmissao).toLocaleDateString('pt-BR')}</td>
                                  <td style={{ padding: '10px' }}>
                                  <span style={{
                                    padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                                    backgroundColor: t.statusTermo === 'ATIVO' ? '#e8f8f5' : '#f2f4f4',
                                    color: t.statusTermo === 'ATIVO' ? '#117a65' : '#7f8c8d'
                                  }}>
                                    {t.statusTermo === 'ATIVO' ? 'Vigente / Ativo' : 'Finalizado'}
                                  </span>
                                  </td>
                                  <td style={{ padding: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleBaixarPdf(t.idTermo)}
                                        style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline', fontSize: '12px' }}
                                    >
                                      📄 PDF
                                    </button>
                                  </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', padding: '15px', color: '#999', fontStyle: 'italic' }}>
                                Nenhuma alocação formal registrada para este ativo.
                              </td>
                            </tr>
                        )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                  <button type="button" className="btn-secondary" onClick={() => setViewModalOpen(false)}>Fechar</button>
                </div>
              </div>
            </div>
        )}

        {deleteModalOpen && selectedEq && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Confirmar Inativação</h2>
                  <button className="btn-close" onClick={closeDeleteModal}>&times;</button>
                </div>
                <div className="modal-form">
                  <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>
                    Tem certeza que deseja inativar o equipamento <strong>{selectedEq.nomeEquipamento}</strong>?
                  </p>

                  {deleteError && (
                      <div style={{ marginTop: '15px', padding: '12px 15px', backgroundColor: '#fdecea', color: '#c0392b', borderRadius: '6px', fontSize: '14px', borderLeft: '4px solid #e74c3c' }}>
                        <strong>Ação Negada:</strong> {deleteError}
                      </div>
                  )}
                </div>

                <div className="modal-footer" style={{ padding: '20px 25px' }}>
                  <button className="btn-secondary" onClick={closeDeleteModal}>Cancelar</button>
                  <button className="btn-primary" style={{ backgroundColor: '#e74c3c', color: 'white' }} onClick={confirmDelete}>Inativar Equipamento</button>
                </div>
              </div>
            </div>
        )}

      </div>
  );
}

export default Equipamentos;