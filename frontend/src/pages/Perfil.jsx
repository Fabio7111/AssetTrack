import React, { useState } from 'react';
import './Perfil.css';
import imagemFundo from '../assets/fundo-perfil.png';

function Perfil() {
  const [activeTab, setActiveTab] = useState('dados');

  const [usuario] = useState({
    nome: 'Natã',
    email: 'nata.ti@unimedassis.exemplo.com',
    perfil: 'Administrador (TI)',
    dataCadastro: '15/01/2026',
    status: 'Ativo'
  });

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

      <div className="perfil-layout">
        
        <aside className="perfil-card-side">
          <div className="avatar-wrapper">
            <div className="avatar-circle">
              {usuario.nome.charAt(0)}
            </div>
            <span className={`status-dot ${usuario.status.toLowerCase()}`}></span>
          </div>
          
          <h2 className="perfil-nome">{usuario.nome}</h2>
          <span className="perfil-cargo">{usuario.perfil}</span>
          
          <div className="perfil-info-list">
            <div className="info-item">
              <span className="info-label">E-mail:</span>
              <span className="info-value">{usuario.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Membro desde:</span>
              <span className="info-value">{usuario.dataCadastro}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Estado:</span>
              <span className="info-value status-text">{usuario.status}</span>
            </div>
          </div>
        </aside>

        <main className="perfil-content">
          <div className="perfil-tabs">
            <button 
              className={`tab-btn ${activeTab === 'dados' ? 'active' : ''}`}
              onClick={() => setActiveTab('dados')}
            >
              Dados Pessoais
            </button>
            <button 
              className={`tab-btn ${activeTab === 'seguranca' ? 'active' : ''}`}
              onClick={() => setActiveTab('seguranca')}
            >
              Segurança & Senha
            </button>
            <button 
              className={`tab-btn ${activeTab === 'sessoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('sessoes')}
            >
              Registo de Acessos
            </button>
          </div>

          <div className="tab-content">
            
            {activeTab === 'dados' && (
              <div className="animate-fade">
                <h3>Informações da Conta</h3>
                <p className="tab-description">Atualize o seu nome e endereço de contacto.</p>
                
                <div className="perfil-form">
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input type="text" defaultValue={usuario.nome} />
                  </div>
                  <div className="form-group">
                    <label>Endereço de E-mail</label>
                    <input type="email" defaultValue={usuario.email} />
                  </div>
                  <button className="btn-primary mt-15">Guardar Alterações</button>
                </div>
              </div>
            )}

            {activeTab === 'seguranca' && (
              <div className="animate-fade">
                <h3>Alterar Palavra-passe</h3>
                <p className="tab-description">Certifique-se de usar uma palavra-passe forte e única.</p>
                
                <div className="perfil-form max-w-400">
                  <div className="form-group">
                    <label>Palavra-passe Atual</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label>Nova Palavra-passe</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Nova Palavra-passe</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <button className="btn-primary mt-15">Atualizar Senha</button>
                </div>
              </div>
            )}

            {activeTab === 'sessoes' && (
              <div className="animate-fade">
                <h3>Atividade Recente</h3>
                <p className="tab-description">Histórico dos seus últimos inícios de sessão no sistema.</p>
                
                <table className="custom-table zebrada mt-15">
                  <thead>
                    <tr>
                      <th>Data e Hora</th>
                      <th>Ação Realizada</th>
                      <th>IP / Dispositivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Hoje, 08:30</td>
                      <td>Login bem-sucedido</td>
                      <td>192.168.1.45 (Windows)</td>
                    </tr>
                    <tr>
                      <td>Ontem, 17:45</td>
                      <td>Encerramento de sessão</td>
                      <td>192.168.1.45 (Windows)</td>
                    </tr>
                    <tr>
                      <td>01/06/2026, 09:12</td>
                      <td>Login bem-sucedido</td>
                      <td>192.168.1.45 (Windows)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default Perfil;