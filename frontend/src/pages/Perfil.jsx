import React, { useState, useEffect } from 'react';
import './Perfil.css';
import imagemFundo from '../assets/fundo-perfil.png';
import api from '../services/api';

function Perfil() {
  const [activeTab, setActiveTab] = useState('dados');
  const [loading,   setLoading]   = useState(true);
  const [message,   setMessage]   = useState(null);

  const [usuario,      setUsuario]      = useState(null);
  const [logs,         setLogs]         = useState([]);
  const [loadingLogs,  setLoadingLogs]  = useState(false);

  const [formDados,    setFormDados]    = useState({ nome: '', email: '' });
  const [salvandoDados, setSalvandoDados] = useState(false);

  const [formSenha,    setFormSenha]    = useState({
    senhaAtual: '', novaSenha: '', confirmarSenha: ''
  });
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  useEffect(() => {
    if (activeTab === 'sessoes') carregarLogs();
  }, [activeTab]);

  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const res = await api.get('/usuarios/me');
      setUsuario(res.data);
      setFormDados({ nome: res.data.nome, email: res.data.email });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      showMessage('Erro ao carregar dados do perfil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const carregarLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await api.get('/log-acessos/me');
      setLogs(res.data);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      showMessage('Erro ao carregar histórico de acessos.', 'error');
    } finally {
      setLoadingLogs(false);
    }
  };

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return '—';
    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR', {
      day:    '2-digit',
      month:  '2-digit',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    });
  };

  const handleSalvarDados = async (e) => {
    e.preventDefault();
    if (!formDados.nome.trim() || !formDados.email.trim()) {
      showMessage('Preencha todos os campos.', 'error');
      return;
    }
    setSalvandoDados(true);
    try {
      const res = await api.put('/usuarios/me', {
        nome:     formDados.nome,
        email:    formDados.email,
        senha:    null,
        idPerfil: null,
      });
      setUsuario(res.data);
      showMessage('Dados atualizados com sucesso!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao salvar dados.', 'error');
    } finally {
      setSalvandoDados(false);
    }
  };

  const handleTrocarSenha = async (e) => {
    e.preventDefault();

    if (!formSenha.senhaAtual || !formSenha.novaSenha || !formSenha.confirmarSenha) {
      showMessage('Preencha todos os campos de senha.', 'error');
      return;
    }
    if (formSenha.novaSenha !== formSenha.confirmarSenha) {
      showMessage('A nova senha e a confirmação não coincidem.', 'error');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(formSenha.novaSenha)) {
      showMessage(
          'A senha deve ter no mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo.',
          'error'
      );
      return;
    }

    setSalvandoSenha(true);
    try {
      await api.put('/usuarios/me/senha', {
        senhaAtual: formSenha.senhaAtual,
        novaSenha:  formSenha.novaSenha,
      });
      setFormSenha({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      showMessage('Senha alterada com sucesso!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erro ao alterar senha.', 'error');
    } finally {
      setSalvandoSenha(false);
    }
  };

  if (loading) return <div className="loading-state">Carregando...</div>;

  return (
      <div className="perfil-container">

        <header className="perfil-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <div>
              <h1>👤 Meu Perfil</h1>
              <p>Faça a gestão da sua conta, credenciais e histórico de acesso.</p>
            </div>
          </div>
        </header>

        {message && (
            <div className={`alert-message ${message.type}`}>{message.text}</div>
        )}

        <div className="perfil-layout">

          <aside className="perfil-card-side">
            <div className="avatar-wrapper">
              <div className="avatar-circle">
                {usuario?.nome?.charAt(0).toUpperCase()}
              </div>
              <span className={`status-dot ${usuario?.status?.toLowerCase()}`}></span>
            </div>

            <h2 className="perfil-nome">{usuario?.nome}</h2>
            <span className="perfil-cargo">{usuario?.nomePerfil}</span>

            <div className="perfil-info-list">
              <div className="info-item">
                <span className="info-label">E-mail</span>
                <span className="info-value">{usuario?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado</span>
                <span className="info-value status-text">{usuario?.status}</span>
              </div>
            </div>
          </aside>

          <main className="perfil-content">
            <div className="perfil-tabs">
              {[
                { key: 'dados',     label: 'Dados Pessoais'     },
                { key: 'seguranca', label: 'Segurança & Senha'  },
                { key: 'sessoes',   label: 'Registo de Acessos' },
              ].map(({ key, label }) => (
                  <button
                      key={key}
                      className={`tab-btn ${activeTab === key ? 'active' : ''}`}
                      onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
              ))}
            </div>

            <div className="tab-content">

              {activeTab === 'dados' && (
                  <div className="animate-fade">
                    <h3>Informações da Conta</h3>
                    <p className="tab-description">Atualize o seu nome e endereço de contacto.</p>

                    <form className="perfil-form" onSubmit={handleSalvarDados}>
                      <div className="form-group">
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            value={formDados.nome}
                            onChange={e => setFormDados({ ...formDados, nome: e.target.value })}
                            required
                        />
                      </div>
                      <div className="form-group">
                        <label>Endereço de E-mail</label>
                        <input
                            type="email"
                            value={formDados.email}
                            onChange={e => setFormDados({ ...formDados, email: e.target.value })}
                            required
                        />
                      </div>
                      <button type="submit" className="btn-primary mt-15" disabled={salvandoDados}>
                        {salvandoDados ? 'Salvando...' : 'Guardar Alterações'}
                      </button>
                    </form>
                  </div>
              )}

              {activeTab === 'seguranca' && (
                  <div className="animate-fade">
                    <h3>Alterar Palavra-passe</h3>
                    <p className="tab-description">Certifique-se de usar uma palavra-passe forte e única.</p>

                    <form className="perfil-form max-w-400" onSubmit={handleTrocarSenha}>
                      <div className="form-group">
                        <label>Senha Atual</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formSenha.senhaAtual}
                            onChange={e => setFormSenha({ ...formSenha, senhaAtual: e.target.value })}
                            required
                        />
                      </div>
                      <div className="form-group">
                        <label>Nova Senha</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formSenha.novaSenha}
                            onChange={e => setFormSenha({ ...formSenha, novaSenha: e.target.value })}
                            required
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirmar Nova Senha</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formSenha.confirmarSenha}
                            onChange={e => setFormSenha({ ...formSenha, confirmarSenha: e.target.value })}
                            required
                        />
                      </div>
                      <button type="submit" className="btn-primary mt-15" disabled={salvandoSenha}>
                        {salvandoSenha ? 'Salvando...' : 'Atualizar Senha'}
                      </button>
                    </form>
                  </div>
              )}

              {activeTab === 'sessoes' && (
                  <div className="animate-fade">
                    <h3>Atividade Recente</h3>
                    <p className="tab-description">Histórico dos seus últimos inícios de sessão no sistema.</p>

                    {loadingLogs ? (
                        <div className="loading-state" style={{ padding: '30px' }}>Carregando...</div>
                    ) : logs.length === 0 ? (
                        <p style={{ color: '#888', fontSize: '14px', marginTop: '20px' }}>
                          Nenhum acesso registado ainda.
                        </p>
                    ) : (
                        <table className="custom-table zebrada mt-15">
                          <thead>
                          <tr>
                            <th>Data e Hora</th>
                            <th>Ação Realizada</th>
                          </tr>
                          </thead>
                          <tbody>
                          {logs.map(log => (
                              <tr key={log.id}>
                                <td style={{ whiteSpace: 'nowrap' }}>{formatarDataHora(log.dataHora)}</td>
                                <td>{log.acaoRealizada}</td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                    )}
                  </div>
              )}

            </div>
          </main>
        </div>
      </div>
  );
}

export default Perfil;