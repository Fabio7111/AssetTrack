import React, { useState } from 'react';
import './Configuracoes.css';
import imagemFundo from '../assets/fundo-config.png';

function Configuracoes() {
  const [activeTab, setActiveTab] = useState('geral');

  const [setores] = useState([
    { id: 1, nome: 'Faturamento / Dispensação', localizacao: 'Andar 1 - Bloco A' },
    { id: 2, nome: 'TI / Data Center', localizacao: 'Subsolo - Sala Segura' },
    { id: 3, nome: 'Atendimento', localizacao: 'Térreo - Recepção Principal' }
  ]);

  const [perfis] = useState([
    { id: 1, nome: 'Administrador (TI)', descricao: 'Acesso total a módulos, auditoria e configurações.' },
    { id: 2, nome: 'Colaborador Padrão', descricao: 'Acesso restrito a solicitações e consultas básicas.' },
    { id: 3, nome: 'Gestor de Frota', descricao: 'Acesso a movimentações e relatórios operacionais.' }
  ]);

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

      <div className="config-layout">
        
        <aside className="config-sidebar">
          <nav>
            <button 
              className={`config-nav-item ${activeTab === 'geral' ? 'active' : ''}`}
              onClick={() => setActiveTab('geral')}
            >
              🏢 Sistema & Geral
            </button>
            <button 
              className={`config-nav-item ${activeTab === 'setores' ? 'active' : ''}`}
              onClick={() => setActiveTab('setores')}
            >
              📍 Gestão de Setores
            </button>
            <button 
              className={`config-nav-item ${activeTab === 'perfis' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfis')}
            >
              🔐 Perfis de Acesso
            </button>
            <button 
              className={`config-nav-item ${activeTab === 'notificacoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notificacoes')}
            >
              🔔 Notificações
            </button>
          </nav>
        </aside>

        <main className="config-content">
          
          {activeTab === 'geral' && (
            <div className="tab-pane animate-fade">
              <h2>Preferências Globais</h2>
              <p className="tab-desc">Defina as informações base da organização para os relatórios.</p>
              
              <div className="config-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome da Organização</label>
                    <input type="text" defaultValue="Unimed Assis" />
                  </div>
                  <div className="form-group">
                    <label>Fuso Horário Padrão</label>
                    <select defaultValue="America/Sao_Paulo">
                      <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                      <option value="Europe/Lisbon">Lisboa (GMT)</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>E-mail de Suporte Técnico</label>
                  <input type="email" defaultValue="ti@unimedassis.exemplo.com" />
                </div>
                
                <div className="form-actions">
                  <button className="btn-save">Salvar Alterações</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'setores' && (
            <div className="tab-pane animate-fade">
              <div className="pane-header">
                <div>
                  <h2>Locais Físicos & Setores</h2>
                  <p className="tab-desc">Faça a gestão dos locais onde os equipamentos estão alocados.</p>
                </div>
                <button className="btn-primary-small">+ Adicionar Setor</button>
              </div>

              <table className="config-table">
                <thead>
                  <tr>
                    <th>Nome do Setor</th>
                    <th>Localização Física</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {setores.map(setor => (
                    <tr key={setor.id}>
                      <td className="fw-bold">{setor.nome}</td>
                      <td>{setor.localizacao}</td>
                      <td>
                        <button className="btn-icon-text edit">Editar</button>
                        <button className="btn-icon-text delete">Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'perfis' && (
            <div className="tab-pane animate-fade">
              <div className="pane-header">
                <div>
                  <h2>Níveis e Perfis de Acesso</h2>
                  <p className="tab-desc">Controle as permissões para a equipa técnica e colaboradores padrão.</p>
                </div>
                <button className="btn-primary-small">+ Criar Perfil</button>
              </div>

              <div className="perfis-grid">
                {perfis.map(perfil => (
                  <div className="perfil-card" key={perfil.id}>
                    <h4>{perfil.nome}</h4>
                    <p>{perfil.descricao}</p>
                    <button className="btn-outline">Ver Permissões</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notificacoes' && (
            <div className="tab-pane animate-fade">
              <h2>Alertas do Sistema</h2>
              <p className="tab-desc">Escolha como o sistema deve alertar a equipa sobre eventos cruciais.</p>
              
              <div className="toggles-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Alerta de Baixo Estoque</strong>
                    <span>Enviar e-mail quando um consumível chegar a zero.</span>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Devoluções Atrasadas</strong>
                    <span>Notificar a TI se um empréstimo passar da data limite.</span>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Configuracoes;