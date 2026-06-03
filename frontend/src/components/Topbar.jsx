import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Topbar.css';

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
            🔔
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
                    <span>Há 10 min</span>
                  </div>
                </div>
              </div>
              
              <div className="popup-footer">
                <button onClick={() => { setShowNotifications(false); navigate('/solicitacoes'); }}>
                  Ver todas as solicitações
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div 
          className={`user-profile-trigger ${isPerfilActive ? 'active' : ''}`} 
          onClick={irParaPerfil} 
          title="Aceder ao Meu Perfil"
        >
          <div className="avatar-small">
            👤
          </div>
          <span className="user-name">Natã</span>
        </div>
      </div>

    </header>
  );
}

export default Topbar;