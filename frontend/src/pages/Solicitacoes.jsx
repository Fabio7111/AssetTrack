import React, { useState, useEffect } from 'react';
import './Solicitacoes.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-solic.png';
import detalhesIcon from '../assets/Detalhes Icon.png';
import aprovarIcon  from '../assets/Aprovar Icon.png';
import recusarIcon  from '../assets/Recusar Icon.png';
import iniciarIcon  from '../assets/Iniciar Icon.png';
import concluirIcon from '../assets/Concluir Icon.png';

const STATUS_LABEL = {
  ABERTA:       'Aberta',
  APROVADA:     'Aprovada',
  RECUSADA:     'Recusada',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDA:    'Concluída',
};

const STATUS_CLASS = {
  ABERTA:       'aberta',
  APROVADA:     'aprovada',
  RECUSADA:     'recusada',
  EM_ANDAMENTO: 'em-andamento',
  CONCLUIDA:    'concluida',
};

function Solicitacoes() {
  const [aba, setAba] = useState('manutencao');

  const [solManutencao, setSolManutencao] = useState([]);
  const [solEstoque,    setSolEstoque]    = useState([]);
  const [equipamentos,  setEquipamentos]  = useState([]);
  const [itens,         setItens]         = useState([]);
  const [usuario,       setUsuario]       = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [modalAbrir,    setModalAbrir]    = useState(false);
  const [modalAvaliar,  setModalAvaliar]  = useState(false);
  const [modalDetalhe,  setModalDetalhe]  = useState(false);
  const [selecionada,   setSelecionada]   = useState(null);

  const [formManutencao, setFormManutencao] = useState({ idEquipamento: '', descricaoProblema: '' });
  const [formEstoque,    setFormEstoque]    = useState({ idItem: '', quantidadeSolicitada: 1, observacao: '' });
  const [formAvaliacao,  setFormAvaliacao]  = useState({ nota: 0, comentarios: '' });
  const [salvando,       setSalvando]       = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const isGestor = usuario && ['MODERADOR', 'ADMINISTRADOR'].includes(
      (usuario.nomePerfil || '').toUpperCase()
  );

  useEffect(() => { carregarTudo(); }, []);

  const carregarTudo = async () => {
    setLoading(true);
    try {
      const resMe = await api.get('/usuarios/me');
      const me = resMe.data;
      setUsuario(me);

      const gestor = ['MODERADOR', 'ADMINISTRADOR'].includes(
          (me.nomePerfil || '').toUpperCase()
      );

      const rotaMan = gestor ? '/solicitacoes/manutencao' : '/solicitacoes/manutencao/minhas';
      const rotaEst = gestor ? '/solicitacoes/estoque'    : '/solicitacoes/estoque/minhas';

      const [resMan, resEst, resEq, resItens] = await Promise.all([
        api.get(rotaMan),
        api.get(rotaEst),
        api.get('/equipamentos'),
        api.get('/estoque'),
      ]);
      setSolManutencao(resMan.data);
      setSolEstoque(resEst.data);
      setEquipamentos(resEq.data);
      setItens(resItens.data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      showMessage('Erro ao carregar dados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (d) => d ? new Date(d).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '—';

  const abrirModalNovo = () => {
    setFormManutencao({ idEquipamento: '', descricaoProblema: '' });
    setFormEstoque({ idItem: '', quantidadeSolicitada: 1, observacao: '' });
    setModalAbrir(true);
  };

  const handleAbrirChamado = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      if (aba === 'manutencao') {
        if (!formManutencao.idEquipamento || !formManutencao.descricaoProblema.trim()) {
          showMessage('Preencha equipamento e descrição.', 'error'); setSalvando(false); return;
        }
        await api.post('/solicitacoes/manutencao', formManutencao);
      } else {
        if (!formEstoque.idItem) {
          showMessage('Selecione o item.', 'error'); setSalvando(false); return;
        }
        await api.post('/solicitacoes/estoque', {
          ...formEstoque,
          quantidadeSolicitada: Number(formEstoque.quantidadeSolicitada) || 1,
        });
      }
      showMessage('Chamado aberto com sucesso!', 'success');
      setModalAbrir(false);
      carregarTudo();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao abrir chamado.', 'error');
    } finally { setSalvando(false); }
  };

  const mudarStatus = async (sol, novoStatus) => {
    const endpoint = sol.tipo === 'MANUTENCAO' ? 'manutencao' : 'estoque';
    try {
      await api.put(`/solicitacoes/${endpoint}/${sol.idSolicitacao}/status`, { status: novoStatus });
      showMessage(`Status atualizado para ${STATUS_LABEL[novoStatus]}.`, 'success');
      carregarTudo();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao atualizar status.', 'error');
    }
  };

  const abrirModalAvaliar = (sol) => {
    setSelecionada(sol);
    setFormAvaliacao({ nota: 0, comentarios: '' });
    setModalAvaliar(true);
  };

  const handleAvaliar = async (e) => {
    e.preventDefault();
    if (formAvaliacao.nota < 1) { showMessage('Selecione uma nota de 1 a 5.', 'error'); return; }
    setSalvando(true);
    try {
      const payload = {
        notaServico: formAvaliacao.nota,
        comentarios: formAvaliacao.comentarios,
        idSolicitacaoManutencao: selecionada.tipo === 'MANUTENCAO' ? selecionada.idSolicitacao : null,
        idSolicitacaoEstoque:    selecionada.tipo === 'ESTOQUE'    ? selecionada.idSolicitacao : null,
      };
      await api.post('/solicitacoes/avaliar', payload);
      showMessage('Avaliação enviada. Obrigado!', 'success');
      setModalAvaliar(false);
      carregarTudo();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao avaliar.', 'error');
    } finally { setSalvando(false); }
  };

  const abrirDetalhe = (sol) => { setSelecionada(sol); setModalDetalhe(true); };

  const lista = aba === 'manutencao' ? solManutencao : solEstoque;

  const equipamentosAtivos = equipamentos.filter(
      eq => (eq.statusAtual || '').toUpperCase() === 'ATIVO'
  );

  const totalAbertas   = lista.filter(s => s.status === 'ABERTA').length;
  const totalAndamento = lista.filter(s => s.status === 'EM_ANDAMENTO').length;
  const totalConcluidas = lista.filter(s => s.status === 'CONCLUIDA').length;

  if (loading) return <div className="loading-state">Carregando solicitações...</div>;

  return (
      <div className="solicitacoes-container">

        <header className="solicitacoes-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <div>
              <h1>🎫 Solicitações</h1>
              <p>Abra chamados de manutenção e pedidos de materiais, e acompanhe o atendimento.</p>
            </div>
            <div className="header-actions">
              <button className="btn-primary" onClick={abrirModalNovo}>+ Abrir Chamado</button>
            </div>
          </div>
        </header>

        {message && <div className={`alert-message ${message.type}`}>{message.text}</div>}

        <section className="metrics-grid">
          <div className="metric-card highlight">
            <div className="metric-icon">📨</div>
            <div className="metric-info"><h3>Abertas</h3><p className="metric-value">{totalAbertas}</p></div>
          </div>
          <div className="metric-card warning">
            <div className="metric-icon">🛠️</div>
            <div className="metric-info"><h3>Em Andamento</h3><p className="metric-value">{totalAndamento}</p></div>
          </div>
          <div className="metric-card success">
            <div className="metric-icon">✅</div>
            <div className="metric-info"><h3>Concluídas</h3><p className="metric-value">{totalConcluidas}</p></div>
          </div>
        </section>

        <div className="solic-tabs">
          <button className={`solic-tab-btn ${aba === 'manutencao' ? 'active' : ''}`} onClick={() => setAba('manutencao')}>
            🛠️ Manutenção
          </button>
          <button className={`solic-tab-btn ${aba === 'estoque' ? 'active' : ''}`} onClick={() => setAba('estoque')}>
            📦 Estoque
          </button>
        </div>

        <section className="table-section">
          <div className="table-header">
            <h2>{aba === 'manutencao' ? 'Chamados de Manutenção' : 'Pedidos de Material'}</h2>
          </div>

          {lista.length === 0 ? (
              <div className="solic-empty">Nenhuma solicitação registrada.</div>
          ) : (
              <table className="custom-table zebrada">
                <thead>
                <tr>
                  <th>Abertura</th>
                  {aba === 'manutencao' ? <th>Equipamento</th> : <th>Item</th>}
                  <th>{aba === 'manutencao' ? 'Problema' : 'Qtd / Obs.'}</th>
                  <th>Solicitante</th>
                  <th>Status</th>
                  <th>Conclusão</th>
                  <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {lista.map(s => (
                    <tr key={s.idSolicitacao}>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatarData(s.dataAbertura)}</td>
                      <td className="fw-bold">{aba === 'manutencao' ? s.nomeEquipamento : s.nomeItem}</td>
                      <td>{aba === 'manutencao'
                          ? s.descricaoProblema
                          : `${s.quantidadeSolicitada} un.${s.observacao ? ' — ' + s.observacao : ''}`}</td>
                      <td>{s.nomeSolicitante || '—'}</td>
                      <td><span className={`status-badge ${STATUS_CLASS[s.status]}`}>{STATUS_LABEL[s.status]}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatarData(s.dataConclusao)}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" title="Detalhes" onClick={() => abrirDetalhe(s)}>
                            <img src={detalhesIcon} alt="Detalhes" />
                          </button>

                          {isGestor && s.status === 'ABERTA' && (
                              <>
                                <button className="btn-icon" title="Aprovar" onClick={() => mudarStatus(s, 'APROVADA')}>
                                  <img src={aprovarIcon} alt="Aprovar" />
                                </button>
                                <button className="btn-icon" title="Recusar" onClick={() => mudarStatus(s, 'RECUSADA')}>
                                  <img src={recusarIcon} alt="Recusar" />
                                </button>
                              </>
                          )}
                          {isGestor && s.status === 'APROVADA' && (
                              <button className="btn-icon" title="Iniciar" onClick={() => mudarStatus(s, 'EM_ANDAMENTO')}>
                                <img src={iniciarIcon} alt="Iniciar" />
                              </button>
                          )}
                          {isGestor && s.status === 'EM_ANDAMENTO' && (
                              <button className="btn-icon" title="Concluir" onClick={() => mudarStatus(s, 'CONCLUIDA')}>
                                <img src={concluirIcon} alt="Concluir" />
                              </button>
                          )}

                          {(s.status === 'CONCLUIDA' || s.status === 'RECUSADA') && !s.avaliada && (
                              <button className="btn-status avaliar" onClick={() => abrirModalAvaliar(s)}>★ Avaliar</button>
                          )}
                          {s.avaliada && (
                              <span className="nota-exibicao" title={s.comentarios || 'Avaliado'}>{s.nota}★</span>
                          )}
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </section>

        {modalAbrir && (
            <div className="modal-overlay" onClick={() => setModalAbrir(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Abrir Chamado — {aba === 'manutencao' ? 'Manutenção' : 'Material'}</h2>
                  <button className="btn-close" onClick={() => setModalAbrir(false)}>&times;</button>
                </div>
                <form onSubmit={handleAbrirChamado} className="modal-form">
                  {aba === 'manutencao' ? (
                      <>
                        <div className="form-group">
                          <label>Equipamento *</label>
                          <select value={formManutencao.idEquipamento}
                                  onChange={e => setFormManutencao({ ...formManutencao, idEquipamento: e.target.value })} required>
                            <option value="">Selecione o equipamento</option>
                            {equipamentosAtivos.length === 0 ? (
                                <option value="" disabled>Nenhum equipamento ativo disponível</option>
                            ) : (
                                equipamentosAtivos.map(eq => (
                                    <option key={eq.idEquipamento} value={eq.idEquipamento}>{eq.nomeEquipamento}</option>
                                ))
                            )}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Descrição do Problema *</label>
                          <textarea placeholder="Descreva o problema..." value={formManutencao.descricaoProblema}
                                    onChange={e => setFormManutencao({ ...formManutencao, descricaoProblema: e.target.value })}
                                    style={{ minHeight: '90px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical' }}
                                    required />
                        </div>
                      </>
                  ) : (
                      <>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Item *</label>
                            <select value={formEstoque.idItem}
                                    onChange={e => setFormEstoque({ ...formEstoque, idItem: e.target.value })} required>
                              <option value="">Selecione o item</option>
                              {itens.map(i => (
                                  <option key={i.idItem} value={i.idItem}>{i.nomeItem} ({i.quantidadeDisponivel} un.)</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Quantidade *</label>
                            <input type="number" min="1" value={formEstoque.quantidadeSolicitada}
                                   onChange={e => setFormEstoque({ ...formEstoque, quantidadeSolicitada: e.target.value })} required />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Observação</label>
                          <textarea placeholder="Justificativa, urgência..." value={formEstoque.observacao}
                                    onChange={e => setFormEstoque({ ...formEstoque, observacao: e.target.value })}
                                    style={{ minHeight: '80px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical' }} />
                        </div>
                      </>
                  )}
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setModalAbrir(false)}>Cancelar</button>
                    <button type="submit" className="btn-primary" disabled={salvando}>
                      {salvando ? 'Enviando...' : 'Abrir Chamado'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {modalAvaliar && selecionada && (
            <div className="modal-overlay" onClick={() => setModalAvaliar(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Avaliar Atendimento</h2>
                  <button className="btn-close" onClick={() => setModalAvaliar(false)}>&times;</button>
                </div>
                <form onSubmit={handleAvaliar} className="modal-form">
                  <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
                    Como você avalia o atendimento da solicitação{' '}
                    <strong>{selecionada.tipo === 'MANUTENCAO' ? selecionada.nomeEquipamento : selecionada.nomeItem}</strong>?
                  </p>
                  <div className="estrelas-wrapper">
                    {[1, 2, 3, 4, 5].map(n => (
                        <span key={n}
                              className={`estrela ${n <= formAvaliacao.nota ? 'ativa' : ''}`}
                              onClick={() => setFormAvaliacao({ ...formAvaliacao, nota: n })}>
                    ★
                  </span>
                    ))}
                  </div>
                  <div className="form-group">
                    <label>Comentários / Sugestões</label>
                    <textarea placeholder="Conte como foi o atendimento..." value={formAvaliacao.comentarios}
                              onChange={e => setFormAvaliacao({ ...formAvaliacao, comentarios: e.target.value })}
                              style={{ minHeight: '90px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical' }} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setModalAvaliar(false)}>Cancelar</button>
                    <button type="submit" className="btn-primary" disabled={salvando}>
                      {salvando ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {modalDetalhe && selecionada && (
            <div className="modal-overlay" onClick={() => setModalDetalhe(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Detalhes da Solicitação</h2>
                  <button className="btn-close" onClick={() => setModalDetalhe(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo</label>
                      <input type="text" value={selecionada.tipo === 'MANUTENCAO' ? 'Manutenção' : 'Estoque'} disabled />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <input type="text" value={STATUS_LABEL[selecionada.status]} disabled />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{selecionada.tipo === 'MANUTENCAO' ? 'Equipamento' : 'Item'}</label>
                    <input type="text" value={selecionada.tipo === 'MANUTENCAO' ? selecionada.nomeEquipamento : selecionada.nomeItem} disabled />
                  </div>
                  <div className="form-group">
                    <label>{selecionada.tipo === 'MANUTENCAO' ? 'Problema' : 'Observação'}</label>
                    <input type="text" value={selecionada.tipo === 'MANUTENCAO'
                        ? selecionada.descricaoProblema
                        : `${selecionada.quantidadeSolicitada} un.${selecionada.observacao ? ' — ' + selecionada.observacao : ''}`} disabled />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Aberto em</label>
                      <input type="text" value={formatarData(selecionada.dataAbertura)} disabled />
                    </div>
                    <div className="form-group">
                      <label>Concluído em</label>
                      <input type="text" value={formatarData(selecionada.dataConclusao)} disabled />
                    </div>
                  </div>
                  {selecionada.avaliada && (
                      <div className="form-group">
                        <label>Avaliação</label>
                        <input type="text" value={`${selecionada.nota}★ ${selecionada.comentarios ? '— ' + selecionada.comentarios : ''}`} disabled />
                      </div>
                  )}
                </div>
                <div className="modal-footer" style={{ marginTop: '20px' }}>
                  <button className="btn-secondary" onClick={() => setModalDetalhe(false)}>Fechar</button>
                </div>
              </div>
            </div>
        )}

      </div>
  );
}

export default Solicitacoes;