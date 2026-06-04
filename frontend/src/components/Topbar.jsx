import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Topbar.css';
import sairIcon from '../assets/Sair Icon.png';
import notificIcon from '../assets/Notific Icon.png';
import perfilIcon from '../assets/Perfil Icon.png';

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const isPerfilActive = location.pathname === '/perfil';

  const irParaPerfil = () => {
    setShowNotifications(false);
    navigate('/perfil');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
                onClick={toggleNotifications}
                title="Notificações"
            >
              <img src={notificIcon} alt="Notificações" className="topbar-icon" />
              <span className="notification-badge"></span>
            </button>

            {showNotifications && (
                <div className="notifications-popup animate-fade-in">
                  <div className="popup-header">
                    <h4>Central de Alertas</h4>
                    <button className="btn-clear-all" onClick={() => setShowNotifications(false)}>Limpar</button>
                  </div>
                  <div className="popup-body">
                    <div className="notification-item unread">
                      <div className="noti-icon">⚠️</div>
                      <div className="noti-content">
                        <p>O equipamento <strong>Extensor Wi-Fi TP-Link</strong> está com a devolução em atraso.</p>
                      </div>
                    </div>
                  </div>
                  <div className="popup-footer">
                    <button onClick={() => { setShowNotifications(false); navigate('/solicitacoes'); }}>Ver todas</button>
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
            <span className="user-name">Natã</span>
          </div>

          <button
              className="btn-logout-trigger"
              onClick={handleLogout}
              title="Sair do Sistema"
          >
            <img src={sairIcon} alt="Sair" className="logout-icon" />
          </button>
        </div>
      </header>
  );
}

export default Topbar;