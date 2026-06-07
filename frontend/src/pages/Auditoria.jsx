import React, { useState, useEffect } from 'react';
import './Auditoria.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-invent.png';
import detalhesIcon from '../assets/Detalhes Icon.png';
import iniciarIcon  from '../assets/Iniciar Icon.png';

const STATUS_LABEL = { PENDENTE: 'Pendente', EM_ANDAMENTO: 'Em Andamento', CONCLUIDA: 'Concluída' };
const STATUS_CLASS = { PENDENTE: 'pendente', EM_ANDAMENTO: 'em-andamento', CONCLUIDA: 'concluida' };

function Auditoria() {
    const [auditorias, setAuditorias] = useState([]);
    const [setores,    setSetores]    = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [message,    setMessage]    = useState(null);

    const [modalNova, setModalNova] = useState(false);
    const [form, setForm] = useState({ tipoAuditoria: 'EQUIPAMENTO', descricao: '', idSetorAuditado: '' });
    const [salvando, setSalvando] = useState(false);

    const [busca,      setBusca]      = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroSetor, setFiltroSetor] = useState('');
    const [dataDe,     setDataDe]     = useState('');
    const [dataAte,    setDataAte]    = useState('');

    const [auditoriaAtiva, setAuditoriaAtiva] = useState(null);
    const [planilha, setPlanilha]             = useState([]);
    const [enviando, setEnviando]             = useState(false);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3500);
    };

    useEffect(() => { carregar(); }, []);

    const carregar = async () => {
        setLoading(true);
        try {
            const [resAud, resSet] = await Promise.all([
                api.get('/auditorias'),
                api.get('/setores'),
            ]);
            setAuditorias(resAud.data);
            setSetores(resSet.data);
        } catch (error) {
            console.error('Erro ao carregar auditorias:', error);
            showMessage('Erro ao carregar dados.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (d) => d ? new Date(d).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : '—';

    const handleRegistrar = async (e) => {
        e.preventDefault();
        setSalvando(true);
        try {
            await api.post('/auditorias', {
                ...form,
                idSetorAuditado: form.idSetorAuditado || null,
            });
            showMessage('Auditoria registrada!', 'success');
            setModalNova(false);
            setForm({ tipoAuditoria: 'EQUIPAMENTO', descricao: '', idSetorAuditado: '' });
            carregar();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Erro ao registrar.', 'error');
        } finally { setSalvando(false); }
    };

    const iniciarAuditoria = async (aud) => {
        try {
            const res = await api.put(`/auditorias/${aud.idAuditoria}/iniciar`);
            setAuditoriaAtiva(aud);
            setPlanilha(res.data.map(linha => ({
                ...linha,
                quantidadeContada: linha.tipo === 'ESTOQUE' ? (linha.quantidadeAtual ?? 0) : 1,
                numeroSerieContado: linha.numeroSerieAtual || '',
                observacao: '',
            })));
            carregar();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Erro ao iniciar auditoria.', 'error');
        }
    };

    const abrirPlanilhaConcluida = async (aud) => {
        try {
            const res = await api.get(`/auditorias/${aud.idAuditoria}/itens`);
            setAuditoriaAtiva({ ...aud, somenteLeitura: true });
            setPlanilha(res.data.map(item => ({
                id: item.id,
                tipo: item.tipo,
                nome: item.nome,
                categoria: item.contexto,
                quantidadeAtual: item.quantidadeContada,
                quantidadeContada: item.quantidadeContada ?? 0,
                numeroSerieContado: item.numeroSerieContado || '',
                observacao: item.observacao || '',
            })));
        } catch (error) {
            showMessage(error.response?.data?.message || 'Erro ao abrir planilha.', 'error');
        }
    };

    const atualizarLinha = (idx, campo, valor) => {
        setPlanilha(prev => prev.map((l, i) => i === idx ? { ...l, [campo]: valor } : l));
    };

    const handleEnviar = async () => {
        setEnviando(true);
        try {
            const payload = planilha.map(l => ({
                idEquipamento:      l.tipo === 'EQUIPAMENTO' ? l.id : null,
                idItemEstoque:      l.tipo === 'ESTOQUE'     ? l.id : null,
                quantidadeContada:  Number(l.quantidadeContada) || 0,
                numeroSerieContado: l.numeroSerieContado || null,
                observacao:         l.observacao || null,
            }));
            await api.post(`/auditorias/${auditoriaAtiva.idAuditoria}/enviar`, payload);
            showMessage('Auditoria enviada! Valores atualizados nas telas de origem.', 'success');
            setAuditoriaAtiva(null);
            setPlanilha([]);
            carregar();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Erro ao enviar auditoria.', 'error');
        } finally { setEnviando(false); }
    };

    const fecharPlanilha = () => { setAuditoriaAtiva(null); setPlanilha([]); };

    const exportarExcel = () => {
        const headers = ['ID', 'Inicio', 'Tipo', 'Descricao', 'Setor', 'Auditor', 'Status', 'Conclusao'];
        const csvRows = auditoriasFiltradas.map((a, index) => [
            index + 1,
            a.dataInicio ? new Date(a.dataInicio).toLocaleString('pt-BR') : '-',
            a.tipoAuditoria === 'ESTOQUE' ? 'Estoque' : 'Equipamentos',
            a.descricao || '',
            a.nomeSetor || 'Geral',
            a.nomeAuditor || '',
            STATUS_LABEL[a.status],
            a.dataConclusao ? new Date(a.dataConclusao).toLocaleString('pt-BR') : '-',
        ].map(v => `"${v}"`).join(','));
        const csvContent = "\uFEFF" + [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'relatorio_auditorias.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const auditoriasFiltradas = auditorias.filter(a => {
        const texto = `${a.descricao || ''} ${a.nomeAuditor || ''} ${a.nomeSetor || ''}`.toLowerCase();
        if (busca && !texto.includes(busca.toLowerCase())) return false;
        if (filtroTipo && a.tipoAuditoria !== filtroTipo) return false;
        if (filtroSetor && a.nomeSetor !== filtroSetor) return false;
        if (dataDe && new Date(a.dataInicio) < new Date(dataDe)) return false;
        if (dataAte && new Date(a.dataInicio) > new Date(dataAte + 'T23:59:59')) return false;
        return true;
    });

    const totalPendentes  = auditorias.filter(a => a.status === 'PENDENTE').length;
    const totalAndamento  = auditorias.filter(a => a.status === 'EM_ANDAMENTO').length;
    const totalConcluidas = auditorias.filter(a => a.status === 'CONCLUIDA').length;

    if (loading) return <div className="loading-state">Carregando auditorias...</div>;

    if (auditoriaAtiva) {
        const isEquip = auditoriaAtiva.tipoAuditoria === 'EQUIPAMENTO';
        const leitura = auditoriaAtiva.somenteLeitura;
        return (
            <div className="auditoria-container">
                <header className="auditoria-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
                    <div className="header-content">
                        <div>
                            <h1>📋 Planilha de Auditoria — {isEquip ? 'Equipamentos' : 'Estoque'}</h1>
                            <p>{auditoriaAtiva.descricao || 'Confira e ajuste a contagem de cada item.'}</p>
                        </div>
                        <div className="header-actions">
                            <button className="btn-secondary-light" onClick={fecharPlanilha}>Voltar</button>
                            {!leitura && (
                                <button className="btn-primary" onClick={handleEnviar} disabled={enviando}>
                                    {enviando ? 'Enviando...' : '✓ Enviar Auditoria'}
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {message && <div className={`alert-message ${message.type}`}>{message.text}</div>}

                <section className="table-section">
                    <div className="table-header">
                        <h2>{planilha.length} {isEquip ? 'equipamento(s)' : 'item(ns)'} {leitura ? 'auditado(s)' : 'para conferência'}</h2>
                    </div>
                    <table className="custom-table zebrada planilha">
                        <thead>
                        <tr>
                            <th>{isEquip ? 'Equipamento' : 'Item'}</th>
                            <th>{isEquip ? 'Setor' : 'Categoria'}</th>
                            {isEquip
                                ? <><th>Nº de Série</th><th>Encontrado?</th></>
                                : <><th>Qtd. {leitura ? 'Auditada' : 'Sistema'}</th><th>Qtd. Contada</th></>}
                            <th>Observação</th>
                        </tr>
                        </thead>
                        <tbody>
                        {planilha.map((l, idx) => (
                            <tr key={l.id}>
                                <td className="fw-bold">{l.nome}</td>
                                <td>{l.categoria || '—'}</td>

                                {isEquip ? (
                                    <>
                                        <td>
                                            <input type="text" className="cell-input" value={l.numeroSerieContado}
                                                   disabled={leitura}
                                                   onChange={e => atualizarLinha(idx, 'numeroSerieContado', e.target.value)} />
                                        </td>
                                        <td>
                                            <select className="cell-input" value={l.quantidadeContada}
                                                    disabled={leitura}
                                                    onChange={e => atualizarLinha(idx, 'quantidadeContada', Number(e.target.value))}>
                                                <option value={1}>✓ Encontrado</option>
                                                <option value={0}>✗ Não encontrado</option>
                                            </select>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{l.quantidadeAtual ?? 0}</td>
                                        <td>
                                            <input type="number" min="0" className="cell-input" value={l.quantidadeContada}
                                                   disabled={leitura}
                                                   onChange={e => atualizarLinha(idx, 'quantidadeContada', e.target.value)} />
                                        </td>
                                    </>
                                )}

                                <td>
                                    <input type="text" className="cell-input" placeholder={leitura ? '—' : 'Opcional...'}
                                           value={l.observacao}
                                           disabled={leitura}
                                           onChange={e => atualizarLinha(idx, 'observacao', e.target.value)} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </div>
        );
    }

    return (
        <div className="auditoria-container">
            <header className="auditoria-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
                <div className="header-content">
                    <div>
                        <h1>📋 Auditoria de Ativos</h1>
                        <p>Registre contagens de inventário de Equipamentos e Estoque, e corrija os ativos de uma vez.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-primary" onClick={() => setModalNova(true)}>+ Registrar Auditoria</button>
                    </div>
                </div>
            </header>

            {message && <div className={`alert-message ${message.type}`}>{message.text}</div>}

            <section className="metrics-grid">
                <div className="metric-card pendente">
                    <div className="metric-icon">🕓</div>
                    <div className="metric-info"><h3>Pendentes</h3><p className="metric-value">{totalPendentes}</p></div>
                </div>
                <div className="metric-card andamento">
                    <div className="metric-icon">⚙️</div>
                    <div className="metric-info"><h3>Em Andamento</h3><p className="metric-value">{totalAndamento}</p></div>
                </div>
                <div className="metric-card concluida">
                    <div className="metric-icon">✅</div>
                    <div className="metric-info"><h3>Concluídas</h3><p className="metric-value">{totalConcluidas}</p></div>
                </div>
            </section>

            <section className="filters-card">
                <div className="filters-grid">
                    <div className="filter-group filter-busca">
                        <label>Buscar</label>
                        <input type="text" placeholder="Descrição, auditor ou setor..."
                               value={busca} onChange={e => setBusca(e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <label>Tipo</label>
                        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="EQUIPAMENTO">Equipamentos</option>
                            <option value="ESTOQUE">Estoque</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Setor</label>
                        <select value={filtroSetor} onChange={e => setFiltroSetor(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Geral">Geral</option>
                            {setores.map(s => <option key={s.idSetor} value={s.nomeSetor}>{s.nomeSetor}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>De</label>
                        <input type="date" value={dataDe} onChange={e => setDataDe(e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <label>Até</label>
                        <input type="date" value={dataAte} onChange={e => setDataAte(e.target.value)} />
                    </div>
                </div>
            </section>

            <section className="table-section">
                <div className="table-header">
                    <h2>Auditorias Registradas ({auditoriasFiltradas.length})</h2>
                    <button className="btn-secondary" onClick={exportarExcel}>Exportar para Excel</button>
                </div>
                {auditoriasFiltradas.length === 0 ? (
                    <div className="aud-empty">Nenhuma auditoria encontrada.</div>
                ) : (
                    <table className="custom-table zebrada">
                        <thead>
                        <tr>
                            <th>Início</th>
                            <th>Tipo</th>
                            <th>Descrição</th>
                            <th>Setor</th>
                            <th>Auditor</th>
                            <th>Status</th>
                            <th>Conclusão</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {auditoriasFiltradas.map(a => (
                            <tr key={a.idAuditoria}>
                                <td style={{ whiteSpace: 'nowrap' }}>{formatarData(a.dataInicio)}</td>
                                <td><span className={`tipo-tag ${a.tipoAuditoria === 'ESTOQUE' ? 'estoque' : 'equipamento'}`}>
                    {a.tipoAuditoria === 'ESTOQUE' ? 'Estoque' : 'Equipamentos'}
                  </span></td>
                                <td>{a.descricao || '—'}</td>
                                <td>{a.nomeSetor || 'Geral'}</td>
                                <td>{a.nomeAuditor || '—'}</td>
                                <td><span className={`status-badge ${STATUS_CLASS[a.status]}`}>{STATUS_LABEL[a.status]}</span></td>
                                <td style={{ whiteSpace: 'nowrap' }}>{formatarData(a.dataConclusao)}</td>
                                <td>
                                    <div className="action-buttons">
                                        {(a.status === 'PENDENTE' || a.status === 'EM_ANDAMENTO') && (
                                            <button className="btn-icon" title={a.status === 'PENDENTE' ? 'Iniciar' : 'Continuar'}
                                                    onClick={() => iniciarAuditoria(a)}>
                                                <img src={iniciarIcon} alt="Iniciar" />
                                            </button>
                                        )}
                                        {a.status === 'CONCLUIDA' && (
                                            <button className="btn-icon" title="Ver planilha" onClick={() => abrirPlanilhaConcluida(a)}>
                                                <img src={detalhesIcon} alt="Ver" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>

            {modalNova && (
                <div className="modal-overlay" onClick={() => setModalNova(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Registrar Nova Auditoria</h2>
                            <button className="btn-close" onClick={() => setModalNova(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleRegistrar} className="modal-form">
                            <div className="form-group">
                                <label>Tipo de Auditoria *</label>
                                <select value={form.tipoAuditoria}
                                        onChange={e => setForm({ ...form, tipoAuditoria: e.target.value })} required>
                                    <option value="EQUIPAMENTO">Equipamentos (Switches, PCs, Notebooks)</option>
                                    <option value="ESTOQUE">Estoque (Cabos, periféricos, consumíveis)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Setor (opcional)</label>
                                <select value={form.idSetorAuditado}
                                        onChange={e => setForm({ ...form, idSetorAuditado: e.target.value })}>
                                    <option value="">Geral (todos)</option>
                                    {setores.map(s => <option key={s.idSetor} value={s.idSetor}>{s.nomeSetor}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Descrição</label>
                                <input type="text" placeholder="Ex: Contagem mensal da sala da TI"
                                       value={form.descricao}
                                       onChange={e => setForm({ ...form, descricao: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setModalNova(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>
                                    {salvando ? 'Registrando...' : 'Registrar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Auditoria;