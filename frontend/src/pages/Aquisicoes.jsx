import React, { useState, useEffect } from 'react';
import './Aquisicoes.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-aquisicoes.png';

import detalhesIcon from '../assets/Detalhes Icon.png';
import editarIcon from '../assets/Editar Icon.png';
import excluirIcon from '../assets/Excluir Icon.png';

function Aquisicoes() {
  const [aquisicoes, setAquisicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [editingAq, setEditingAq] = useState(null);
  const [selectedAq, setSelectedAq] = useState(null);

  const [deleteError, setDeleteError] = useState('');

  const [formData, setFormData] = useState({
    fornecedor: '',
    dataCompra: '',
    numeroNotaFiscal: '',
    valorTotal: ''
  });

  useEffect(() => {
    fetchAquisicoes();
  }, []);

  const fetchAquisicoes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/aquisicoes');
      setAquisicoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar aquisições:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const totalInvestimentos = aquisicoes.reduce((acc, curr) => acc + (Number(curr.valorTotal) || 0), 0);
  const totalEntradas = aquisicoes.length;

  const filteredAquisicoes = aquisicoes.filter(aq => {
    const matchesSearch = aq.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (aq.numeroNotaFiscal && aq.numeroNotaFiscal.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesData = true;
    if (filterDataInicio || filterDataFim) {
      const aqDate = new Date(aq.dataCompra + 'T00:00:00'); // Trata o fuso horário
      aqDate.setHours(0, 0, 0, 0);

      if (filterDataInicio) {
        const startDate = new Date(filterDataInicio + 'T00:00:00');
        if (aqDate < startDate) matchesData = false;
      }
      if (filterDataFim) {
        const endDate = new Date(filterDataFim + 'T00:00:00');
        if (aqDate > endDate) matchesData = false;
      }
    }

    return matchesSearch && matchesData;
  });

  const exportToExcel = () => {
    const headers = ['Fornecedor', 'Data de Compra', 'Nota Fiscal', 'Valor Total'];

    const csvRows = filteredAquisicoes.map(aq => [
      aq.fornecedor,
      new Date(aq.dataCompra).toLocaleDateString('pt-BR'),
      aq.numeroNotaFiscal || 'N/A',
      aq.valorTotal
    ].map(val => `"${val}"`).join(','));

    const csvContent = "\uFEFF" + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_aquisicoes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenModal = (aq = null) => {
    const isEdit = aq && aq.idAquisicao;
    setEditingAq(isEdit ? aq : null);
    setFormData(isEdit ?
        {
          fornecedor: aq.fornecedor || '',
          dataCompra: aq.dataCompra || '',
          numeroNotaFiscal: aq.numeroNotaFiscal || '',
          valorTotal: aq.valorTotal || ''
        } :
        { fornecedor: '', dataCompra: '', numeroNotaFiscal: '', valorTotal: '' }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAq(null);
    setFormData({ fornecedor: '', dataCompra: '', numeroNotaFiscal: '', valorTotal: '' });
  };

  const openViewModal = (aq) => {
    setSelectedAq(aq);
    setViewModalOpen(true);
  };

  const openDeleteModal = (aq) => {
    setSelectedAq(aq);
    setDeleteError('');
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteError('');
  };

  const handleSaveAq = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        valorTotal: parseFloat(formData.valorTotal)
      };

      if (editingAq) {
        await api.put(`/aquisicoes/${editingAq.idAquisicao}`, payload);
      } else {
        await api.post('/aquisicoes', payload);
      }
      handleCloseModal();
      fetchAquisicoes();
    } catch (error) {
      alert("Erro ao salvar aquisição: " + (error.response?.data?.message || "Verifique os dados."));
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteError('');
      await api.delete(`/aquisicoes/${selectedAq.idAquisicao}`);
      fetchAquisicoes();
      setDeleteModalOpen(false);
      setSelectedAq(null);
    } catch (error) {
      setDeleteError("Não é possível excluir esta compra, pois já existem registros vinculados.");
    }
  };

  if (loading) return <div className="dashboard-loading">Carregando dados...</div>;

  return (
      <div className="aquisicoes-container">

        <header className="aquisicoes-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <div>
              <h1>🛒 Gestão de Aquisições</h1>
              <p>Controle de compras, fornecedores e entrada de novos ativos.</p>
            </div>
            <button className="btn-primary" onClick={() => handleOpenModal(null)}>
              + Nova Compra
            </button>
          </div>
        </header>

        <section className="metrics-grid aquisicoes-metrics">
          <div className="metric-card highlight">
            <div className="metric-icon">💰</div>
            <div className="metric-info">
              <h3>Investimento Total (Registrado)</h3>
              <p className="metric-value">{formatCurrency(totalInvestimentos)}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📦</div>
            <div className="metric-info">
              <h3>Total de Notas Registradas</h3>
              <p className="metric-value">{totalEntradas}</p>
            </div>
          </div>
        </section>

        <div className="filters-container" style={{ flexWrap: 'wrap' }}>
          <input
              type="text"
              placeholder="Buscar por Fornecedor ou Nota Fiscal..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="filter-input-search"
              style={{ minWidth: '300px' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Comprado a partir de:</span>
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
            <h2>Histórico de Aquisições</h2>
            <button className="btn-secondary" onClick={exportToExcel}>Exportar para Excel</button>
          </div>

          <div className="table-responsive">
            <table className="custom-table zebrada">
              <thead>
              <tr>
                <th>Fornecedor</th>
                <th>Data de Compra</th>
                <th>Nota Fiscal</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
              </thead>
              <tbody>
              {filteredAquisicoes.length > 0 ? (
                  filteredAquisicoes.map((compra) => (
                      <tr key={compra.idAquisicao}>
                        <td className="fw-bold">{compra.fornecedor}</td>
                        <td>{new Date(compra.dataCompra + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                        <td>{compra.numeroNotaFiscal || '-'}</td>
                        <td className="fw-bold text-success">{formatCurrency(compra.valorTotal)}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon" onClick={() => openViewModal(compra)} title="Detalhes">
                              <img src={detalhesIcon} alt="Detalhes" className="action-icon" />
                            </button>
                            <button className="btn-icon" onClick={() => handleOpenModal(compra)} title="Editar">
                              <img src={editarIcon} alt="Editar" className="action-icon" />
                            </button>
                            <button className="btn-icon" onClick={() => openDeleteModal(compra)} title="Excluir">
                              <img src={excluirIcon} alt="Excluir" className="action-icon" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                      Nenhuma aquisição encontrada.
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
                  <h2>{editingAq ? 'Editar Aquisição' : 'Nova Aquisição'}</h2>
                  <button className="btn-close" onClick={handleCloseModal}>&times;</button>
                </div>

                <form className="modal-form" onSubmit={handleSaveAq}>
                  <div className="form-group">
                    <label>Nome do Fornecedor</label>
                    <input
                        type="text"
                        value={formData.fornecedor}
                        onChange={e => setFormData({...formData, fornecedor: e.target.value})}
                        required
                        autoComplete="off"
                    />
                  </div>

                  <div className="form-group">
                    <label>Data da Compra</label>
                    <input
                        type="datetime-local"
                        value={formData.dataCompra}
                        onChange={e => setFormData({...formData, dataCompra: e.target.value})}
                        required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Número da Nota Fiscal</label>
                      <input
                          type="text"
                          value={formData.numeroNotaFiscal}
                          onChange={e => setFormData({...formData, numeroNotaFiscal: e.target.value})}
                          autoComplete="off"
                      />
                    </div>
                    <div className="form-group">
                      <label>Valor Total (R$)</label>
                      <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.valorTotal}
                          onChange={e => setFormData({...formData, valorTotal: e.target.value})}
                          required
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                    <button type="submit" className="btn-primary">Salvar Aquisição</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {viewModalOpen && selectedAq && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Detalhes da Aquisição</h2>
                  <button className="btn-close" onClick={() => setViewModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <div className="form-group">
                    <label>ID Sistêmico</label>
                    <input type="text" value={selectedAq.idAquisicao} disabled />
                  </div>

                  <div className="form-group">
                    <label>Fornecedor</label>
                    <input type="text" value={selectedAq.fornecedor} disabled />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Nota Fiscal</label>
                      <input type="text" value={selectedAq.numeroNotaFiscal || 'Não Registrado'} disabled />
                    </div>
                    <div className="form-group">
                      <label>Data de Compra</label>
                      <input type="text" value={new Date(selectedAq.dataCompra + 'T00:00:00').toLocaleDateString('pt-BR')} disabled />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Valor Investido</label>
                    <input type="text" value={formatCurrency(selectedAq.valorTotal)} disabled />
                  </div>
                </div>

                <div className="modal-footer" style={{ marginTop: '20px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setViewModalOpen(false)}>Fechar</button>
                </div>
              </div>
            </div>
        )}

        {deleteModalOpen && selectedAq && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Confirmar Exclusão</h2>
                  <button className="btn-close" onClick={closeDeleteModal}>&times;</button>
                </div>

                <div className="modal-form">
                  <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>
                    Tem certeza que deseja apagar a nota fiscal <strong>{selectedAq.numeroNotaFiscal || selectedAq.fornecedor}</strong>?
                  </p>

                  {deleteError ? (
                      <div style={{ marginTop: '15px', padding: '12px 15px', backgroundColor: '#fdecea', color: '#c0392b', borderRadius: '6px', fontSize: '14px', borderLeft: '4px solid #e74c3c' }}>
                        <strong>Ação Negada:</strong> {deleteError}
                      </div>
                  ) : (
                      <span style={{color: '#c0392b', fontSize: '13px', display: 'block', marginTop: '10px'}}>
                  Atenção: Esta ação não pode ser desfeita.
                </span>
                  )}
                </div>

                <div className="modal-footer" style={{ padding: '20px 25px' }}>
                  <button className="btn-secondary" onClick={closeDeleteModal}>Cancelar</button>
                  <button className="btn-primary" style={{ backgroundColor: '#e74c3c', color: 'white' }} onClick={confirmDelete}>
                    Excluir Aquisição
                  </button>
                </div>
              </div>
            </div>
        )}

      </div>
  );
}

export default Aquisicoes;