import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Topbar.css';
import api from '../services/api';
import sairIcon    from '../assets/Sair Icon.png';
import notificIcon from '../assets/Notific Icon.png';
import perfilIcon  from '../assets/Perfil Icon.png';

const POLLING_INTERVAL = 5 * 60 * 1000;

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [atrasadas,         setAtrasadas]         = useState([]);
  const [alertaAtivo,       setAlertaAtivo]       = useState(false);
  const [primeiroNome,      setPrimeiroNome]      = useState('');

  const [alertaEstoqueAtivo, setAlertaEstoqueAtivo] = useState(false);
  const [itensBaixoEstoque,  setItensBaixoEstoque]  = useState([]);

  const isPerfilActive = location.pathname === '/perfil';

  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  useEffect(() => {
    api.get('/usuarios/me')
        .then(res => {
          const nome = res.data.nome || '';
          setPrimeiroNome(nome.split(' ')[0]);
        })
        .catch(err => console.error('Erro ao buscar usuário:', err));
  }, []);

  const carregarAlertas = useCallback(async () => {
    try {
      const resConfig = await api.get('/configuracoes');
      const ativoDevolucao = resConfig.data.alertaDevolucaoAtrasada;
      const ativoEstoque   = resConfig.data.alertaBaixoEstoque;
      setAlertaAtivo(ativoDevolucao);
      setAlertaEstoqueAtivo(ativoEstoque);

      if (ativoDevolucao) {
        const resAtrasadas = await api.get('/movimentacoes/atrasadas');
        setAtrasadas(resAtrasadas.data);
      } else {
        setAtrasadas([]);
      }

      if (ativoEstoque) {
        const resEstoque = await api.get('/estoque');
        const baixos = resEstoque.data.filter(
            i => i.status === 'BAIXO_ESTOQUE' || i.status === 'ESGOTADO'
        );
        setItensBaixoEstoque(baixos);
      } else {
        setItensBaixoEstoque([]);
      }
    } catch (error) {
      console.error('Erro ao carregar alertas da topbar:', error);
    }
  }, []);

  useEffect(() => {
    carregarAlertas();
    const intervalo = setInterval(carregarAlertas, POLLING_INTERVAL);
    return () => clearInterval(intervalo);
  }, [carregarAlertas]);

  const irParaPerfil = () => {
    setShowNotifications(false);
    navigate('/perfil');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const temAtrasadas = alertaAtivo && atrasadas.length > 0;
  const temBaixoEstoque = alertaEstoqueAtivo && itensBaixoEstoque.length > 0;
  const temAlertas = temAtrasadas || temBaixoEstoque;

  const STATUS_LABEL = { BAIXO_ESTOQUE: 'baixo estoque', ESGOTADO: 'esgotado' };

  return (
      <header className="topbar">
        <div className="topbar-slogan">
          <span className="slogan-word track">Track.</span>
          <span className="slogan-word manage">Manage.</span>
          <span className="slogan-word optimize">Optimize.</span>
        </div>

        <div className="topbar-actions">
          <div className="notifications-container">
            <button
                className={`btn-icon-topbar ${showNotifications ? 'active' : ''}`}
                onClick={() => setShowNotifications(prev => !prev)}
                title="Notificações"
            >
              <img src={notificIcon} alt="Notificações" className="topbar-icon" />
              {temAlertas && <span className="notification-badge"></span>}
            </button>

            {showNotifications && (
                <div className="notifications-popup animate-fade-in">
                  <div className="popup-header">
                    <h4>Central de Alertas</h4>
                    <button className="btn-clear-all" onClick={() => setShowNotifications(false)}>Fechar</button>
                  </div>

                  <div className="popup-body">

                    {!alertaEstoqueAtivo ? (
                        <div className="notification-item disabled">
                          <div className="noti-icon">📦</div>
                          <div className="noti-content">
                            <p className="noti-title">Baixo Estoque</p>
                            <p className="noti-obs">Alerta desativado nas configurações.</p>
                          </div>
                        </div>
                    ) : itensBaixoEstoque.length === 0 ? (
                        <div className="notification-item ok">
                          <div className="noti-icon">✅</div>
                          <div className="noti-content">
                            <p className="noti-title">Estoque saudável</p>
                            <p className="noti-obs">Nenhum item em baixo estoque no momento.</p>
                          </div>
                        </div>
                    ) : (
                        itensBaixoEstoque.map(item => (
                            <div
                                key={item.idItem}
                                className="notification-item unread"
                                onClick={() => navigate('/estoque')}
                            >
                              <div className="noti-icon">📦</div>
                              <div className="noti-content">
                                <p>
                                  O item <strong>{item.nomeItem}</strong> está em{' '}
                                  <strong>{STATUS_LABEL[item.status] || 'baixo estoque'}</strong>
                                  {' '}({item.quantidadeDisponivel} unid.).
                                </p>
                              </div>
                            </div>
                        ))
                    )}

                    {!alertaAtivo ? (
                        <div className="notification-item disabled">
                          <div className="noti-icon">🔕</div>
                          <div className="noti-content">
                            <p className="noti-title">Devoluções Atrasadas</p>
                            <p className="noti-obs">Alerta desativado nas configurações.</p>
                          </div>
                        </div>
                    ) : atrasadas.length === 0 ? (
                        <div className="notification-item ok">
                          <div className="noti-icon">✅</div>
                          <div className="noti-content">
                            <p className="noti-title">Devoluções em dia</p>
                            <p className="noti-obs">Nenhuma devolução em atraso no momento.</p>
                          </div>
                        </div>
                    ) : (
                        atrasadas.map(m => (
                            <div
                                key={m.idMovimentacao}
                                className="notification-item unread"
                                onClick={() => navigate('/movimentacao')}
                            >
                              <div className="noti-icon">⚠️</div>
                              <div className="noti-content">
                                <p>
                                  O equipamento <strong>{m.equipamento}</strong> está com
                                  devolução em atraso — setor <strong>{m.setorDestino}</strong>.
                                </p>
                              </div>
                            </div>
                        ))
                    )}
                  </div>

                  <div className="popup-footer">
                    <button onClick={() => navigate('/estoque')}>Ver Estoque</button>
                    <button onClick={() => navigate('/movimentacao')}>Ver Movimentações</button>
                  </div>
                </div>
            )}
          </div>

          <div
              className={`user-profile-trigger ${isPerfilActive ? 'active' : ''}`}
              onClick={irParaPerfil}
              title="Aceder ao Meu Perfil"
          >
            <img src={perfilIcon} alt="Perfil" className="avatar-icon" />
            <span className="user-name">{primeiroNome}</span>
          </div>

          <button className="btn-logout-trigger" onClick={handleLogout} title="Sair do Sistema">
            <img src={sairIcon} alt="Sair" className="logout-icon" />
          </button>
        </div>
      </header>
  );
}

export default Topbar;