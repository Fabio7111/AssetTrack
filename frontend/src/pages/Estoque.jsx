import React, { useState, useEffect, useRef } from 'react';
import './Estoque.css';
import imagemFundo from '../assets/fundo-estoque.png';
import detalhesIcon from '../assets/Detalhes Icon.png';
import editarIcon   from '../assets/Editar Icon.png';
import excluirIcon  from '../assets/Excluir Icon.png';
import api from '../services/api';

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f1f3f5"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23aaa">Sem imagem</text></svg>';

const STATUS_LABEL = { DISPONIVEL: 'Disponível', BAIXO_ESTOQUE: 'Baixo Estoque', ESGOTADO: 'Esgotado' };
const STATUS_CLASS  = { DISPONIVEL: 'disponivel', BAIXO_ESTOQUE: 'baixo-estoque', ESGOTADO: 'esgotado' };
const ESTADO_LABEL  = { DISPONIVEL: 'Disponível', EM_USO: 'Em Uso', BAIXO: 'Baixo', ESGOTADO: 'Esgotado', DESCARTADO: 'Descartado' };

const FORM_ITEM_VAZIO     = { nomeItem: '', categoria: '', quantidadeDisponivel: 0, localizacao: '', status: 'DISPONIVEL', imagemBase64: null };
const FORM_UNIDADE_VAZIO  = { idItem: '', patrimonio: '', estado: 'DISPONIVEL', observacao: '', idSetor: '', idUsuario: '' };
const FORM_MOV_VAZIO      = { idItem: '', idUnidade: '', tipo: 'ENTRADA', quantidade: 1, idSetor: '', observacao: '' };

function Estoque() {
  const [abaAtiva, setAbaAtiva] = useState('catalogo');

  const [itens,         setItens]         = useState([]);
  const [unidades,      setUnidades]      = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [setores,       setSetores]       = useState([]);
  const [usuarios,      setUsuarios]      = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalItemFormAberto,    setModalItemFormAberto]    = useState(false);
  const [modalItemDetalheAberto, setModalItemDetalheAberto] = useState(false);
  const [modalItemDeleteAberto,  setModalItemDeleteAberto]  = useState(false);
  const [itemSelecionado,        setItemSelecionado]        = useState(null);
  const [editandoItem,           setEditandoItem]           = useState(null);
  const [formItem,               setFormItem]               = useState(FORM_ITEM_VAZIO);
  const [previewImagem,          setPreviewImagem]          = useState(null);
  const [salvandoItem,           setSalvandoItem]           = useState(false);

  const [modalUnidadeFormAberto,   setModalUnidadeFormAberto]   = useState(false);
  const [modalUnidadeDeleteAberto, setModalUnidadeDeleteAberto] = useState(false);
  const [unidadeSelecionada,       setUnidadeSelecionada]       = useState(null);
  const [editandoUnidade,          setEditandoUnidade]          = useState(null);
  const [formUnidade,              setFormUnidade]              = useState(FORM_UNIDADE_VAZIO);
  const [salvandoUnidade,          setSalvandoUnidade]          = useState(false);
  const [erroExcluirUnidade,       setErroExcluirUnidade]       = useState('');

  const [modalMovAberto, setModalMovAberto] = useState(false);
  const [tipoMov,        setTipoMov]        = useState('ENTRADA');
  const [formMov,        setFormMov]        = useState(FORM_MOV_VAZIO);
  const [salvandoMov,    setSalvandoMov]    = useState(false);

  const fileInputRef = useRef(null);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  useEffect(() => { carregarTudo(); }, []);

  const carregarTudo = async () => {
    setLoading(true);
    try {
      const [resItens, resUnidades, resMov, resSetores, resUsuarios] = await Promise.all([
        api.get('/estoque'),
        api.get('/estoque/unidades'),
        api.get('/estoque/movimentacoes'),
        api.get('/setores'),
        api.get('/usuarios'),
      ]);
      setItens(resItens.data);
      setUnidades(resUnidades.data);
      setMovimentacoes(resMov.data);
      setSetores(resSetores.data);
      setUsuarios(resUsuarios.data);
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
      showMessage('Erro ao carregar dados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const itensFiltrados = itens.filter(i =>
      i.nomeItem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnidades   = itens.reduce((acc, i) => acc + (i.quantidadeDisponivel || 0), 0);
  const totalBaixo      = itens.filter(i => i.status === 'BAIXO_ESTOQUE').length;
  const totalEsgotados  = itens.filter(i => i.status === 'ESGOTADO').length;

  const abrirModalNovoItem = () => {
    setEditandoItem(null);
    setFormItem(FORM_ITEM_VAZIO);
    setPreviewImagem(null);
    setModalItemFormAberto(true);
  };

  const abrirModalEditarItem = (item) => {
    setEditandoItem(item);
    setFormItem({ nomeItem: item.nomeItem, categoria: item.categoria || '', quantidadeDisponivel: item.quantidadeDisponivel, localizacao: item.localizacao || '', status: item.status, imagemBase64: null });
    setPreviewImagem(item.imagemBase64 || null);
    setModalItemDetalheAberto(false);
    setModalItemFormAberto(true);
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showMessage('Imagem muito grande. Máximo 2MB.', 'error'); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setPreviewImagem(reader.result); setFormItem(prev => ({ ...prev, imagemBase64: reader.result })); };
    reader.readAsDataURL(file);
  };

  const handleSalvarItem = async (e) => {
    e.preventDefault();
    if (!formItem.nomeItem.trim()) { showMessage('Informe o nome do item.', 'error'); return; }
    setSalvandoItem(true);
    try {
      const payload = { ...formItem };
      if (editandoItem && payload.imagemBase64 === null) delete payload.imagemBase64;
      if (editandoItem) {
        await api.put(`/estoque/${editandoItem.idItem}`, payload);
        showMessage('Item atualizado!', 'success');
      } else {
        await api.post('/estoque', payload);
        showMessage('Item cadastrado!', 'success');
      }
      setModalItemFormAberto(false);
      carregarTudo();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao salvar item.', 'error');
    } finally { setSalvandoItem(false); }
  };

  const handleExcluirItem = async () => {
    try {
      await api.delete(`/estoque/${itemSelecionado.idItem}`);
      setModalItemDeleteAberto(false);
      setItemSelecionado(null);
      carregarTudo();
      showMessage('Item removido.', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao remover.', 'error');
    }
  };

  const abrirModalNovaUnidade = (idItemPreSelecionado = '') => {
    setEditandoUnidade(null);
    setFormUnidade({ ...FORM_UNIDADE_VAZIO, idItem: idItemPreSelecionado });
    setModalUnidadeFormAberto(true);
  };

  const abrirModalEditarUnidade = (unidade) => {
    setEditandoUnidade(unidade);
    setFormUnidade({
      idItem:     unidade.idItem     || '',
      patrimonio: unidade.patrimonio || '',
      estado:     unidade.estado     || 'DISPONIVEL',
      observacao: unidade.observacao || '',
      idSetor:    '',
      idUsuario:  '',
    });
    setModalUnidadeFormAberto(true);
  };

  const handleSalvarUnidade = async (e) => {
    e.preventDefault();
    if (!formUnidade.idItem) { showMessage('Selecione o item.', 'error'); return; }
    setSalvandoUnidade(true);
    try {
      const payload = { ...formUnidade, idSetor: formUnidade.idSetor || null, idUsuario: formUnidade.idUsuario || null };
      if (editandoUnidade) {
        await api.put(`/estoque/unidades/${editandoUnidade.idUnidade}`, payload);
        showMessage('Unidade atualizada!', 'success');
      } else {
        await api.post('/estoque/unidades', payload);
        showMessage('Unidade cadastrada!', 'success');
      }
      setModalUnidadeFormAberto(false);
      carregarTudo();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao salvar unidade.', 'error');
    } finally { setSalvandoUnidade(false); }
  };

  const handleExcluirUnidade = async () => {
    try {
      setErroExcluirUnidade('');
      await api.delete(`/estoque/unidades/${unidadeSelecionada.idUnidade}`);
      setModalUnidadeDeleteAberto(false);
      setUnidadeSelecionada(null);
      carregarTudo();
      showMessage('Unidade removida.', 'success');
    } catch (error) {
      setErroExcluirUnidade(error.response?.data?.message || 'Erro ao remover.');
    }
  };

  const abrirModalMov = (tipo) => {
    setTipoMov(tipo);
    setFormMov({ ...FORM_MOV_VAZIO, tipo });
    setModalMovAberto(true);
  };

  const handleSalvarMov = async (e) => {
    e.preventDefault();
    if (!formMov.idItem) { showMessage('Selecione o item.', 'error'); return; }
    setSalvandoMov(true);
    try {
      await api.post('/estoque/movimentacoes', {
        ...formMov,
        idUnidade: formMov.idUnidade || null,
        idSetor:   formMov.idSetor   || null,
        quantidade: Number(formMov.quantidade) || 1,
      });
      showMessage(`${tipoMov === 'ENTRADA' ? 'Entrada' : 'Saída'} registrada!`, 'success');
      setModalMovAberto(false);
      carregarTudo();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao registrar movimentação.', 'error');
    } finally { setSalvandoMov(false); }
  };

  const formatarDataHora = (d) => d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  if (loading) return <div className="loading-state">Carregando estoque...</div>;

  const unidadesDoItem = itemSelecionado ? unidades.filter(u => u.idItem === itemSelecionado.idItem) : [];

  return (
      <div className="estoque-container">

        <header className="estoque-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <div>
              <h1>📦 Catálogo de Estoque</h1>
              <p>Controlo visual de quantidades de consumíveis, peças e periféricos.</p>
            </div>
            <div className="header-buttons">
              <button className="btn-secondary-header" onClick={() => abrirModalMov('SAIDA')}>− Nova Saída</button>
              <button className="btn-primary"          onClick={() => abrirModalMov('ENTRADA')}>+ Nova Entrada</button>
            </div>
          </div>
        </header>

        {message && <div className={`alert-message ${message.type}`}>{message.text}</div>}

        <section className="metrics-grid estoque-metrics">
          <div className="metric-card highlight">
            <div className="metric-icon">📊</div>
            <div className="metric-info">
              <h3>Unidades em Estoque</h3>
              <div className="value-box"><span className="metric-value dark-box">{totalUnidades}</span></div>
            </div>
          </div>
          <div className="metric-card warning">
            <div className="metric-icon">⚠️</div>
            <div className="metric-info">
              <h3>Baixo Estoque</h3>
              <div className="value-box"><span className="metric-value dark-box">{totalBaixo}</span></div>
            </div>
          </div>
          <div className="metric-card dark-mode">
            <div className="metric-icon">🚫</div>
            <div className="metric-info">
              <h3>Esgotados</h3>
              <div className="value-box"><span className="metric-value dark-box">{totalEsgotados}</span></div>
            </div>
          </div>
        </section>

        <div className="estoque-tabs">
          {[
            { key: 'catalogo',      label: '🗂️ Catálogo'         },
            { key: 'unidades',      label: '🔖 Unidades Físicas'  },
            { key: 'historico',     label: '📋 Histórico'         },
          ].map(({ key, label }) => (
              <button key={key} className={`estoque-tab-btn ${abaAtiva === key ? 'active' : ''}`} onClick={() => setAbaAtiva(key)}>
                {label}
              </button>
          ))}
        </div>

        {abaAtiva === 'catalogo' && (
            <section className="catalog-section">
              <div className="catalog-header">
                <h2>Catálogo de Itens</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="text" placeholder="Buscar por nome ou categoria..." className="search-catalog"
                         value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <button className="btn-primary" onClick={abrirModalNovoItem}>+ Novo Item</button>
                </div>
              </div>

              {itensFiltrados.length === 0 ? (
                  <div className="catalog-empty">Nenhum item encontrado.</div>
              ) : (
                  <div className="catalog-grid">
                    {itensFiltrados.map(item => (
                        <div className="item-card" key={item.idItem} onClick={() => { setItemSelecionado(item); setModalItemDetalheAberto(true); }}>
                          <div className="item-image-wrapper" style={{ backgroundImage: `url(${item.imagemBase64 || PLACEHOLDER})` }}>
                    <span className={`status-badge floating ${STATUS_CLASS[item.status] || 'disponivel'}`}>
                      {STATUS_LABEL[item.status] || item.status}
                    </span>
                          </div>
                          <div className="item-card-body">
                            <span className="item-category">{item.categoria || '—'}</span>
                            <h4 className="item-title" title={item.nomeItem}>{item.nomeItem}</h4>
                            <div className="item-meta">
                              <div className={`item-qtd ${item.quantidadeDisponivel === 0 ? 'text-danger' : ''}`}>
                                <strong>{item.quantidadeDisponivel}</strong> <span>unid.</span>
                              </div>
                              {item.localizacao && <div className="item-location">📍 {item.localizacao}</div>}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </section>
        )}

        {abaAtiva === 'unidades' && (
            <section className="catalog-section">
              <div className="catalog-header">
                <h2>Unidades Físicas Cadastradas</h2>
                <button className="btn-primary" onClick={() => abrirModalNovaUnidade()}>+ Nova Unidade</button>
              </div>

              {unidades.length === 0 ? (
                  <div className="catalog-empty">Nenhuma unidade cadastrada.</div>
              ) : (
                  <table className="custom-table zebrada centralizada">
                    <thead>
                    <tr>
                      <th>Item</th>
                      <th>Patrimônio / ID</th>
                      <th>Estado</th>
                      <th>Observação</th>
                      <th>Setor</th>
                      <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {unidades.map(u => (
                        <tr key={u.idUnidade}>
                          <td className="fw-bold">{u.nomeItem}</td>
                          <td>{u.patrimonio || '—'}</td>
                          <td><span className={`status-badge ${STATUS_CLASS[u.estado] || 'disponivel'}`}>{ESTADO_LABEL[u.estado] || u.estado}</span></td>
                          <td>{u.observacao || '—'}</td>
                          <td>{u.nomeSetor || '—'}</td>
                          <td>
                            <div className="action-buttons-estoque">
                              <button className="btn-icon" title="Editar" onClick={() => abrirModalEditarUnidade(u)}>
                                <img src={editarIcon} alt="Editar" />
                              </button>
                              <button className="btn-icon" title="Remover" onClick={() => { setUnidadeSelecionada(u); setErroExcluirUnidade(''); setModalUnidadeDeleteAberto(true); }}>
                                <img src={excluirIcon} alt="Remover" />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              )}
            </section>
        )}

        {abaAtiva === 'historico' && (
            <section className="catalog-section">
              <div className="catalog-header">
                <h2>Histórico de Movimentações</h2>
              </div>

              {movimentacoes.length === 0 ? (
                  <div className="catalog-empty">Nenhuma movimentação registrada.</div>
              ) : (
                  <table className="custom-table zebrada centralizada">
                    <thead>
                    <tr>
                      <th>Data / Hora</th>
                      <th>Tipo</th>
                      <th>Item</th>
                      <th>Patrimônio</th>
                      <th>Qtd</th>
                      <th>Setor</th>
                      <th>Responsável</th>
                      <th>Observação</th>
                    </tr>
                    </thead>
                    <tbody>
                    {movimentacoes.map(m => (
                        <tr key={m.idMovimentacao}>
                          <td style={{ whiteSpace: 'nowrap' }}>{formatarDataHora(m.dataHora)}</td>
                          <td>
                      <span className={`status-badge ${m.tipo === 'ENTRADA' ? 'badge-entrada' : 'badge-saida'}`}>
                        {m.tipo}
                      </span>
                          </td>
                          <td className="fw-bold">{m.nomeItem}</td>
                          <td>{m.patrimonio || '—'}</td>
                          <td>{m.quantidade}</td>
                          <td>{m.nomeSetor || '—'}</td>
                          <td>{m.nomeUsuario || '—'}</td>
                          <td>{m.observacao || '—'}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              )}
            </section>
        )}

        {modalItemDetalheAberto && itemSelecionado && (
            <div className="modal-overlay" onClick={() => setModalItemDetalheAberto(false)}>
              <div className="modal-content modal-detalhe-estoque" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Detalhes do Item</h2>
                  <button className="btn-close" onClick={() => setModalItemDetalheAberto(false)}>&times;</button>
                </div>

                <div className="detalhe-imagem" style={{ backgroundImage: `url(${itemSelecionado.imagemBase64 || PLACEHOLDER})` }} />

                <div className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nome do Item</label>
                      <input type="text" value={itemSelecionado.nomeItem} disabled />
                    </div>
                    <div className="form-group">
                      <label>Categoria</label>
                      <input type="text" value={itemSelecionado.categoria || '—'} disabled />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Quantidade</label>
                      <input type="text" value={`${itemSelecionado.quantidadeDisponivel} unidades`} disabled />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <input type="text" value={STATUS_LABEL[itemSelecionado.status] || itemSelecionado.status} disabled />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Localização</label>
                    <input type="text" value={itemSelecionado.localizacao || '—'} disabled />
                  </div>

                  {unidadesDoItem.length > 0 && (
                      <div className="form-group">
                        <label>Unidades Físicas ({unidadesDoItem.length})</label>
                        <div className="unidades-lista">
                          {unidadesDoItem.map(u => (
                              <div key={u.idUnidade} className="unidade-chip">
                                <span className="unidade-patrimonio">{u.patrimonio || 'Sem patrimônio'}</span>
                                <span className={`status-badge ${STATUS_CLASS[u.estado] || 'disponivel'}`} style={{ fontSize: '10px', padding: '2px 7px' }}>
                          {ESTADO_LABEL[u.estado] || u.estado}
                        </span>
                                {u.observacao && <span className="unidade-obs">{u.observacao}</span>}
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </div>

                <div className="modal-footer" style={{ marginTop: '20px' }}>
                  <button className="btn-table-action delete" onClick={() => { setModalItemDetalheAberto(false); setModalItemDeleteAberto(true); }}>Excluir</button>
                  <button className="btn-secondary" onClick={() => setModalItemDetalheAberto(false)}>Fechar</button>
                  <button className="btn-primary" onClick={() => abrirModalEditarItem(itemSelecionado)}>✏️ Editar</button>
                </div>
              </div>
            </div>
        )}

        {modalItemFormAberto && (
            <div className="modal-overlay" onClick={() => setModalItemFormAberto(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editandoItem ? 'Editar Item' : 'Cadastrar Novo Item'}</h2>
                  <button className="btn-close" onClick={() => setModalItemFormAberto(false)}>&times;</button>
                </div>
                <form onSubmit={handleSalvarItem} className="modal-form">
                  <div className="form-group">
                    <label>Foto do Item</label>
                    <div className="upload-area" onClick={() => fileInputRef.current?.click()}
                         style={previewImagem ? { backgroundImage: `url(${previewImagem})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                      {!previewImagem && (
                          <div className="upload-placeholder">
                            <span className="upload-icon">📷</span>
                            <span>Clique para selecionar uma imagem</span>
                            <span className="upload-hint">JPG, PNG ou WEBP — máx. 2MB</span>
                          </div>
                      )}
                      {previewImagem && (
                          <button type="button" className="upload-remover"
                                  onClick={e => { e.stopPropagation(); setPreviewImagem(null); setFormItem(prev => ({ ...prev, imagemBase64: '' })); }}>×</button>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                           style={{ display: 'none' }} onChange={handleImagemChange} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Nome do Item *</label>
                      <input type="text" placeholder="Ex: Mouse Dell MS3320W" value={formItem.nomeItem}
                             onChange={e => setFormItem({ ...formItem, nomeItem: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Categoria</label>
                      <input type="text" placeholder="Ex: Periféricos" value={formItem.categoria}
                             onChange={e => setFormItem({ ...formItem, categoria: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Quantidade</label>
                      <input type="number" min="0" value={formItem.quantidadeDisponivel}
                             onChange={e => setFormItem({ ...formItem, quantidadeDisponivel: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="form-group">
                      <label>Status (automático)</label>
                      <input type="text" value={
                        formItem.quantidadeDisponivel === 0 ? 'Esgotado'
                            : formItem.quantidadeDisponivel <= 3 ? 'Baixo Estoque'
                                : 'Disponível'
                      } disabled />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Localização</label>
                    <input type="text" placeholder="Ex: Armário A - Gaveta 2" value={formItem.localizacao}
                           onChange={e => setFormItem({ ...formItem, localizacao: e.target.value })} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setModalItemFormAberto(false)}>Cancelar</button>
                    <button type="submit" className="btn-primary" disabled={salvandoItem}>
                      {salvandoItem ? 'Salvando...' : editandoItem ? 'Salvar Alterações' : 'Cadastrar Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {modalItemDeleteAberto && itemSelecionado && (
            <div className="modal-overlay" onClick={() => setModalItemDeleteAberto(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Remover Item</h2>
                  <button className="btn-close" onClick={() => setModalItemDeleteAberto(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>
                    Tem certeza que deseja remover <strong>{itemSelecionado.nomeItem}</strong>?
                  </p>
                  <span style={{ color: '#c0392b', fontSize: '13px', display: 'block', marginTop: '10px' }}>
                Todas as unidades físicas vinculadas também serão removidas.
              </span>
                </div>
                <div className="modal-footer" style={{ padding: '20px 0 0 0' }}>
                  <button className="btn-secondary" onClick={() => setModalItemDeleteAberto(false)}>Cancelar</button>
                  <button className="btn-primary" style={{ backgroundColor: '#e74c3c', color: 'white' }} onClick={handleExcluirItem}>
                    Confirmar Exclusão
                  </button>
                </div>
              </div>
            </div>
        )}

        {modalUnidadeFormAberto && (
            <div className="modal-overlay" onClick={() => setModalUnidadeFormAberto(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editandoUnidade ? 'Editar Unidade' : 'Cadastrar Unidade Física'}</h2>
                  <button className="btn-close" onClick={() => setModalUnidadeFormAberto(false)}>&times;</button>
                </div>
                <form onSubmit={handleSalvarUnidade} className="modal-form">
                  <div className="form-group">
                    <label>Item *</label>
                    <select value={formUnidade.idItem} onChange={e => setFormUnidade({ ...formUnidade, idItem: e.target.value })} required>
                      <option value="">Selecione o item</option>
                      {itens.map(i => <option key={i.idItem} value={i.idItem}>{i.nomeItem}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Patrimônio / ID</label>
                      <input type="text" placeholder="Ex: PAT-2024-005" value={formUnidade.patrimonio}
                             onChange={e => setFormUnidade({ ...formUnidade, patrimonio: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Estado</label>
                      <select value={formUnidade.estado} onChange={e => setFormUnidade({ ...formUnidade, estado: e.target.value })}>
                        <option value="DISPONIVEL">Disponível</option>
                        <option value="EM_USO">Em Uso</option>
                        <option value="BAIXO">Baixo</option>
                        <option value="ESGOTADO">Esgotado</option>
                        <option value="DESCARTADO">Descartado</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Setor</label>
                      <select value={formUnidade.idSetor} onChange={e => setFormUnidade({ ...formUnidade, idSetor: e.target.value })}>
                        <option value="">Nenhum</option>
                        {setores.map(s => <option key={s.idSetor} value={s.idSetor}>{s.nomeSetor}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Responsável</label>
                      <select value={formUnidade.idUsuario} onChange={e => setFormUnidade({ ...formUnidade, idUsuario: e.target.value })}>
                        <option value="">Nenhum</option>
                        {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Observação / Detalhes</label>
                    <textarea placeholder="Ex: 50 metros restantes, estado regular..." value={formUnidade.observacao}
                              onChange={e => setFormUnidade({ ...formUnidade, observacao: e.target.value })}
                              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', minHeight: '70px' }} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setModalUnidadeFormAberto(false)}>Cancelar</button>
                    <button type="submit" className="btn-primary" disabled={salvandoUnidade}>
                      {salvandoUnidade ? 'Salvando...' : editandoUnidade ? 'Salvar Alterações' : 'Cadastrar Unidade'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {modalUnidadeDeleteAberto && unidadeSelecionada && (
            <div className="modal-overlay" onClick={() => setModalUnidadeDeleteAberto(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Remover Unidade</h2>
                  <button className="btn-close" onClick={() => setModalUnidadeDeleteAberto(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>
                    Remover a unidade <strong>{unidadeSelecionada.patrimonio || 'sem patrimônio'}</strong> de <strong>{unidadeSelecionada.nomeItem}</strong>?
                  </p>
                  {erroExcluirUnidade ? (
                      <div style={{ marginTop: '15px', padding: '12px 15px', backgroundColor: '#fdecea', color: '#c0392b', borderRadius: '6px', fontSize: '14px', borderLeft: '4px solid #e74c3c' }}>
                        <strong>Ação Negada:</strong> {erroExcluirUnidade}
                      </div>
                  ) : (
                      <span style={{ color: '#c0392b', fontSize: '13px', display: 'block', marginTop: '10px' }}>
                  Atenção: Esta ação não pode ser desfeita.
                </span>
                  )}
                </div>
                <div className="modal-footer" style={{ padding: '20px 0 0 0' }}>
                  <button className="btn-secondary" onClick={() => setModalUnidadeDeleteAberto(false)}>
                    {erroExcluirUnidade ? 'Fechar' : 'Cancelar'}
                  </button>
                  {!erroExcluirUnidade && (
                      <button className="btn-primary" style={{ backgroundColor: '#e74c3c', color: 'white' }} onClick={handleExcluirUnidade}>
                        Confirmar
                      </button>
                  )}
                </div>
              </div>
            </div>
        )}

        {modalMovAberto && (
            <div className="modal-overlay" onClick={() => setModalMovAberto(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 style={{ color: tipoMov === 'ENTRADA' ? '#27ae60' : '#e74c3c' }}>
                    {tipoMov === 'ENTRADA' ? '+ Nova Entrada' : '− Nova Saída'}
                  </h2>
                  <button className="btn-close" onClick={() => setModalMovAberto(false)}>&times;</button>
                </div>
                <form onSubmit={handleSalvarMov} className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Item *</label>
                      <select value={formMov.idItem} onChange={e => setFormMov({ ...formMov, idItem: e.target.value, idUnidade: '' })} required>
                        <option value="">Selecione o item</option>
                        {itens.map(i => <option key={i.idItem} value={i.idItem}>{i.nomeItem} ({i.quantidadeDisponivel} unid.)</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantidade *</label>
                      <input type="number" min="1" value={formMov.quantidade}
                             onChange={e => setFormMov({ ...formMov, quantidade: e.target.value })} required />
                    </div>
                  </div>

                  {formMov.idItem && unidades.filter(u => u.idItem === formMov.idItem).length > 0 && (
                      <div className="form-group">
                        <label>Unidade Específica (opcional)</label>
                        <select value={formMov.idUnidade} onChange={e => setFormMov({ ...formMov, idUnidade: e.target.value })}>
                          <option value="">Nenhuma — movimentação geral</option>
                          {unidades.filter(u => u.idItem === formMov.idItem).map(u => (
                              <option key={u.idUnidade} value={u.idUnidade}>
                                {u.patrimonio || 'Sem patrimônio'} — {ESTADO_LABEL[u.estado] || u.estado}
                                {u.observacao ? ` (${u.observacao})` : ''}
                              </option>
                          ))}
                        </select>
                      </div>
                  )}

                  <div className="form-group">
                    <label>Setor Destino</label>
                    <select value={formMov.idSetor} onChange={e => setFormMov({ ...formMov, idSetor: e.target.value })}>
                      <option value="">Nenhum</option>
                      {setores.map(s => <option key={s.idSetor} value={s.idSetor}>{s.nomeSetor}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Observação</label>
                    <textarea placeholder="Motivo, destino, detalhes..." value={formMov.observacao}
                              onChange={e => setFormMov({ ...formMov, observacao: e.target.value })}
                              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', minHeight: '70px' }} />
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setModalMovAberto(false)}>Cancelar</button>
                    <button type="submit" className="btn-primary"
                            style={{ backgroundColor: tipoMov === 'SAIDA' ? '#e74c3c' : undefined }}
                            disabled={salvandoMov}>
                      {salvandoMov ? 'Registrando...' : tipoMov === 'ENTRADA' ? 'Confirmar Entrada' : 'Confirmar Saída'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

      </div>
  );
}

export default Estoque;