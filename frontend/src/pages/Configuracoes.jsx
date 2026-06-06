import React, { useState, useEffect } from 'react';
import './Configuracoes.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-config.png';
import detalhesIcon from '../assets/Detalhes Icon.png';
import editarIcon   from '../assets/Editar Icon.png';
import excluirIcon  from '../assets/Excluir Icon.png';

const SETOR_VAZIO = { nomeSetor: '', localizacaoFisica: '' };

const PERFIL_META = {
  USUARIO: {
    icon: '👤',
    cor: '#2980b9',
    corFundo: 'rgba(52, 152, 219, 0.08)',
    corBorda: 'rgba(52, 152, 219, 0.3)',
    permissoes: [
      'Consultar ativos vinculados ao próprio usuário',
      'Abrir solicitações de requisição de equipamentos',
      'Abrir solicitações de manutenção',
      'Visualizar movimentações próprias',
    ],
  },
  MODERADOR: {
    icon: '🛡️',
    cor: '#d35400',
    corFundo: 'rgba(241, 196, 15, 0.08)',
    corBorda: 'rgba(241, 196, 15, 0.4)',
    permissoes: [
      'Todas as permissões de USUÁRIO',
      'Gerir inventário de equipamentos',
      'Registrar e atualizar movimentações de hardware',
      'Atualizar status de manutenções',
      'Extrair relatórios setoriais',
    ],
  },
  ADMINISTRADOR: {
    icon: '👑',
    cor: '#1a7a4a',
    corFundo: 'rgba(39, 174, 96, 0.08)',
    corBorda: 'rgba(39, 174, 96, 0.35)',
    permissoes: [
      'Todas as permissões de MODERADOR',
      'Controle total sobre configurações globais',
      'Acesso às trilhas de auditoria do banco de dados',
      'Gestão de acessos e perfis (IAM)',
      'Aprovação de aquisições de ativos',
    ],
  },
};

function getMeta(nomePerfil) {
  return PERFIL_META[nomePerfil?.toUpperCase()] || {
    icon: '🔐', cor: '#555',
    corFundo: 'rgba(0,0,0,0.04)', corBorda: '#ddd', permissoes: [],
  };
}

function Configuracoes() {
  const [activeTab, setActiveTab] = useState('geral');
  const [loading,   setLoading]   = useState(true);
  const [message,   setMessage]   = useState(null);

  const [config, setConfig] = useState({
    nomeOrganizacao: '', telefone: '', emailSuporte: '',
    alertaBaixoEstoque: true, alertaDevolucaoAtrasada: true,
  });

  const [setores, setSetores] = useState([]);
  const [perfis,  setPerfis]  = useState([]);

  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [viewModalOpen,   setViewModalOpen]   = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSetor,   setSelectedSetor]   = useState(null);
  const [editingSetor,    setEditingSetor]    = useState(null);
  const [formData,        setFormData]        = useState(SETOR_VAZIO);
  const [salvando,        setSalvando]        = useState(false);

  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  const [selectedPerfil,  setSelectedPerfil]  = useState(null);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [resConfig, resSetores, resPerfis] = await Promise.all([
        api.get('/configuracoes'),
        api.get('/setores'),
        api.get('/perfis'),
      ]);
      setConfig(resConfig.data);
      setSetores(resSetores.data);
      setPerfis(resPerfis.data);
    } catch (error) {
      console.error('Erro ao carregar configurações', error);
      showMessage('Erro ao carregar dados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSetores = async () => {
    try {
      const res = await api.get('/setores');
      setSetores(res.data);
    } catch (error) {
      console.error('Erro ao buscar setores', error);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      await api.put('/configuracoes', config);
      showMessage('Configurações salvas com sucesso!', 'success');
    } catch {
      showMessage('Erro ao salvar. Tente novamente.', 'error');
    }
  };

  // ── Toggle — salva imediatamente no backend ───────────────────────────────
  const handleToggleChange = async (field) => {
    // Bloqueia o toggle de estoque enquanto módulo não existe
    if (field === 'alertaBaixoEstoque') return;

    const newConfig = { ...config, [field]: !config[field] };
    try {
      await api.put('/configuracoes', newConfig);
      setConfig(newConfig);
      showMessage('Preferência atualizada!', 'success');
    } catch {
      showMessage('Erro ao atualizar notificação.', 'error');
    }
  };

  const handleOpenModal = (setor = null) => {
    if (setor) {
      setEditingSetor(setor);
      setFormData({ nomeSetor: setor.nomeSetor || '', localizacaoFisica: setor.localizacaoFisica || '' });
    } else {
      setEditingSetor(null);
      setFormData(SETOR_VAZIO);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nomeSetor.trim()) { showMessage('Informe o nome do setor.', 'error'); return; }
    setSalvando(true);
    try {
      if (editingSetor) {
        await api.put(`/setores/${editingSetor.idSetor}`, formData);
        showMessage('Setor atualizado!', 'success');
      } else {
        await api.post('/setores', formData);
        showMessage('Setor cadastrado!', 'success');
      }
      setIsModalOpen(false);
      fetchSetores();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao salvar setor. Tente novamente.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/setores/${selectedSetor.idSetor}`);
      setDeleteModalOpen(false);
      setSelectedSetor(null);
      fetchSetores();
      showMessage('Setor removido.', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao remover setor. Tente novamente.', 'error');
    }
  };

  if (loading) return <div className="loading-state">Carregando...</div>;

  return (
      <div className="configuracoes-container">

        <header className="configuracoes-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <div>
              <h1>⚙️ Configurações do Sistema</h1>
              <p>Faça a gestão de preferências globais, setores físicos e perfis de acesso.</p>
            </div>
          </div>
        </header>

        {message && (
            <div className={`alert-message ${message.type}`}>{message.text}</div>
        )}

        <div className="config-layout">
          <aside className="config-sidebar">
            <nav>
              {[
                { key: 'geral',        label: '🏢 Sistema & Geral'   },
                { key: 'setores',      label: '📍 Gestão de Setores'  },
                { key: 'perfis',       label: '🔐 Perfis de Acesso'   },
                { key: 'notificacoes', label: '🔔 Notificações'       },
              ].map(({ key, label }) => (
                  <button key={key}
                          className={`config-nav-item ${activeTab === key ? 'active' : ''}`}
                          onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
              ))}
            </nav>
          </aside>

          <main className="config-content">

            {/* ════ Geral ════ */}
            {activeTab === 'geral' && (
                <div className="tab-pane animate-fade">
                  <h2>Preferências Globais</h2>
                  <form className="config-form" onSubmit={handleSaveConfig}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nome da Organização</label>
                        <input type="text" value={config.nomeOrganizacao}
                               onChange={e => setConfig({ ...config, nomeOrganizacao: e.target.value })}
                               placeholder="Ex: Empresa XPTO" />
                      </div>
                      <div className="form-group">
                        <label>Telefone / Celular</label>
                        <input type="tel" value={config.telefone}
                               onChange={e => setConfig({ ...config, telefone: e.target.value })}
                               placeholder="Ex: (11) 99999-9999" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>E-mail de Suporte Técnico</label>
                      <input type="email" value={config.emailSuporte}
                             onChange={e => setConfig({ ...config, emailSuporte: e.target.value })}
                             placeholder="Ex: suporte@empresa.com" />
                    </div>
                    <button type="submit" className="btn-primary">Salvar Alterações</button>
                  </form>
                </div>
            )}

            {/* ════ Setores ════ */}
            {activeTab === 'setores' && (
                <div className="tab-pane animate-fade">
                  <div className="table-section">
                    <div className="table-header">
                      <h2>Locais Físicos &amp; Setores</h2>
                      <button className="btn-primary" onClick={() => handleOpenModal(null)}>+ Novo Setor</button>
                    </div>
                    <table className="custom-table zebrada">
                      <thead>
                      <tr>
                        <th style={{ textAlign: 'center', width: '5%'  }}>#</th>
                        <th style={{ textAlign: 'center', width: '35%' }}>Nome do Setor</th>
                        <th style={{ textAlign: 'center', width: '35%' }}>Localização Física</th>
                        <th style={{ textAlign: 'center', width: '10%' }}>Equipamentos</th>
                        <th style={{ textAlign: 'center', width: '15%' }}>Ações</th>
                      </tr>
                      </thead>
                      <tbody>
                      {setores.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                              Nenhum setor cadastrado.
                            </td>
                          </tr>
                      ) : (
                          setores.map((setor, index) => {
                            const temVinculo = setor.totalEquipamentos > 0;
                            return (
                                <tr key={setor.idSetor}>
                                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                  <td style={{ textAlign: 'center' }} className="fw-bold">{setor.nomeSetor}</td>
                                  <td style={{ textAlign: 'center' }}>{setor.localizacaoFisica || '—'}</td>
                                  <td style={{ textAlign: 'center' }}>
                              <span className={`badge-equipamentos ${temVinculo ? 'com-vinculo' : 'sem-vinculo'}`}>
                                {setor.totalEquipamentos}
                              </span>
                                  </td>
                                  <td className="action-buttons">
                                    <button className="btn-icon" title="Detalhes"
                                            onClick={() => { setSelectedSetor(setor); setViewModalOpen(true); }}>
                                      <img src={detalhesIcon} alt="Detalhes" />
                                    </button>
                                    {!temVinculo && (
                                        <>
                                          <button className="btn-icon" title="Editar" onClick={() => handleOpenModal(setor)}>
                                            <img src={editarIcon} alt="Editar" />
                                          </button>
                                          <button className="btn-icon" title="Excluir"
                                                  onClick={() => { setSelectedSetor(setor); setDeleteModalOpen(true); }}>
                                            <img src={excluirIcon} alt="Excluir" />
                                          </button>
                                        </>
                                    )}
                                  </td>
                                </tr>
                            );
                          })
                      )}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}

            {/* ════ Perfis ════ */}
            {activeTab === 'perfis' && (
                <div className="tab-pane animate-fade">
                  <div className="perfis-header">
                    <h2>Níveis e Perfis de Acesso</h2>
                  </div>
                  <div className="perfis-grid">
                    {perfis.map((perfil, index) => {
                      const meta = getMeta(perfil.nomePerfil);
                      return (
                          <div className="perfil-card" key={perfil.id}
                               style={{
                                 '--perfil-cor':   meta.cor,
                                 '--perfil-fundo': meta.corFundo,
                                 '--perfil-borda': meta.corBorda,
                                 animationDelay:   `${index * 0.08}s`,
                               }}
                          >
                            <div className="perfil-card-top">
                              <div className="perfil-icon-wrap">
                                <span className="perfil-icon">{meta.icon}</span>
                              </div>
                              <div className="perfil-nivel">Nível {index + 1}</div>
                            </div>
                            <div className="perfil-card-body">
                              <h4 className="perfil-nome">{perfil.nomePerfil}</h4>
                              <p className="perfil-desc">{perfil.descricao}</p>
                            </div>
                            <div className="perfil-card-footer">
                              <button className="btn-ver-permissoes"
                                      onClick={() => { setSelectedPerfil(perfil); setPerfilModalOpen(true); }}>
                                Ver Permissões
                              </button>
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>
            )}

            {/* ════ Notificações ════ */}
            {activeTab === 'notificacoes' && (
                <div className="tab-pane animate-fade">
                  <h2>Alertas do Sistema</h2>
                  <div className="toggles-list">

                    {/* ── Baixo Estoque: bloqueado até o módulo existir ── */}
                    <div className="toggle-item toggle-disabled" title="Módulo de estoque ainda não configurado">
                      <div className="toggle-info">
                        <strong>Alerta de Baixo Estoque</strong>
                        <span>Disponível após a configuração do módulo de estoque.</span>
                      </div>
                      <label className="switch">
                        <input type="checkbox" checked={false} onChange={() => {}} disabled />
                        <span className="slider round"></span>
                      </label>
                    </div>

                    {/* ── Devoluções Atrasadas: totalmente funcional ── */}
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <strong>Devoluções Atrasadas</strong>
                        <span>Exibe alertas na barra superior quando há devoluções em atraso.</span>
                      </div>
                      <label className="switch">
                        <input type="checkbox"
                               checked={config.alertaDevolucaoAtrasada}
                               onChange={() => handleToggleChange('alertaDevolucaoAtrasada')} />
                        <span className="slider round"></span>
                      </label>
                    </div>

                  </div>
                </div>
            )}

          </main>
        </div>

        {/* ════ Modal: Novo / Editar Setor ════ */}
        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{editingSetor ? 'Editar Setor' : 'Cadastrar Novo Setor'}</h2>
                  <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                </div>
                <form onSubmit={handleSave} className="modal-form">
                  <div className="form-group">
                    <label>Nome do Setor *</label>
                    <input type="text" placeholder="Ex: Tecnologia da Informação"
                           value={formData.nomeSetor}
                           onChange={e => setFormData({ ...formData, nomeSetor: e.target.value })}
                           autoFocus required />
                  </div>
                  <div className="form-group">
                    <label>Localização Física</label>
                    <input type="text" placeholder="Ex: Bloco A - 2º andar"
                           value={formData.localizacaoFisica}
                           onChange={e => setFormData({ ...formData, localizacaoFisica: e.target.value })} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    <button type="submit" className="btn-primary" disabled={salvando}>
                      {salvando ? 'Salvando...' : editingSetor ? 'Salvar Alterações' : 'Cadastrar Setor'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* ════ Modal: Detalhes do Setor ════ */}
        {viewModalOpen && selectedSetor && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Detalhes do Setor</h2>
                  <button className="btn-close" onClick={() => setViewModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <div className="form-group">
                    <label>ID Sistêmico</label>
                    <input type="text" value={selectedSetor.idSetor} disabled />
                  </div>
                  <div className="form-group">
                    <label>Nome do Setor</label>
                    <input type="text" value={selectedSetor.nomeSetor} disabled />
                  </div>
                  <div className="form-group">
                    <label>Localização Física</label>
                    <input type="text" value={selectedSetor.localizacaoFisica || '—'} disabled />
                  </div>
                  <div className="form-group">
                    <label>Equipamentos Vinculados</label>
                    <input type="text" value={selectedSetor.totalEquipamentos} disabled />
                  </div>
                </div>
                <div className="modal-footer" style={{ marginTop: '20px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setViewModalOpen(false)}>Fechar</button>
                </div>
              </div>
            </div>
        )}

        {/* ════ Modal: Confirmar Exclusão ════ */}
        {deleteModalOpen && selectedSetor && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Remover Setor</h2>
                  <button className="btn-close" onClick={() => setDeleteModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>
                    Tem certeza que deseja remover o setor <strong>{selectedSetor.nomeSetor}</strong>?
                  </p>
                  <span style={{ color: '#c0392b', fontSize: '13px', display: 'block', marginTop: '10px' }}>
                Atenção: Esta ação não pode ser desfeita.
              </span>
                </div>
                <div className="modal-footer" style={{ padding: '20px 0 0 0' }}>
                  <button className="btn-secondary" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
                  <button className="btn-primary" style={{ backgroundColor: '#e74c3c', color: 'white' }}
                          onClick={handleDelete}>
                    Confirmar Exclusão
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* ════ Modal: Ver Permissões do Perfil ════ */}
        {perfilModalOpen && selectedPerfil && (() => {
          const meta = getMeta(selectedPerfil.nomePerfil);
          return (
              <div className="modal-overlay">
                <div className="modal-content modal-perfil">
                  <div className="modal-header">
                    <h2 style={{ color: meta.cor }}>{meta.icon} {selectedPerfil.nomePerfil}</h2>
                    <button className="btn-close" onClick={() => setPerfilModalOpen(false)}>&times;</button>
                  </div>
                  <p className="modal-perfil-desc">{selectedPerfil.descricao}</p>
                  <div className="modal-perfil-secao">
                    <span className="modal-perfil-label">Permissões concedidas</span>
                    <ul className="permissoes-lista">
                      {meta.permissoes.map((p, i) => (
                          <li key={i} className="permissao-item">
                            <span className="permissao-check" style={{ color: meta.cor }}>✓</span>
                            {p}
                          </li>
                      ))}
                    </ul>
                  </div>
                  <div className="modal-footer" style={{ marginTop: '24px' }}>
                    <button className="btn-secondary" onClick={() => setPerfilModalOpen(false)}>Fechar</button>
                  </div>
                </div>
              </div>
          );
        })()}

      </div>
  );
}

export default Configuracoes;