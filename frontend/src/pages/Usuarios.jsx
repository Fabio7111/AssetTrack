import React, { useState, useEffect } from 'react';
import './Usuarios.css';
import imagemFundo from '../assets/fundo-usuários.png';

function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockUsers = [
          { id: 1, nome: 'Natã', email: 'nata@assettrack.com', setor: 'Tecnologia', perfil: 'Administrador', ultimoLogin: '02/06/2026 13:00', status: 'Ativo' },
          { id: 2, nome: 'Fábio', email: 'fabio@assettrack.com', setor: 'Tecnologia', perfil: 'Administrador', ultimoLogin: '02/06/2026 09:45', status: 'Ativo' },
          { id: 3, nome: 'Aline Souza', email: 'aline.souza@unimed.com', setor: 'Auditoria', perfil: 'Visualizador', ultimoLogin: '01/06/2026 16:30', status: 'Inativo' }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="dashboard-loading">Carregando métricas do sistema...</div>;
  }

  return (
    <div className="usuarios-container">
      
      <header className="usuarios-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <div className="header-content">
          <div>
            <h1>Gestão de Usuários e Acessos</h1>
            <p>Controle de permissões e registros de funcionários.</p>
          </div>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            + Novo Usuário
          </button>
        </div>
      </header>

      <section className="metrics-grid">
        <div className="metric-card highlight">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>Usuários Ativos</h3>
            <p className="metric-value">02</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🔑</div>
          <div className="metric-info">
            <h3>Acessos Hoje</h3>
            <p className="metric-value">14</p>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">📜</div>
          <div className="metric-info">
            <h3>Total de Logs</h3>
            <p className="metric-value">1.042</p>
          </div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Setor</th>
                <th>Perfil</th>
                <th>Últm Login</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="fw-bold">{user.nome}</td>
                  <td>{user.email}</td>
                  <td>{user.setor}</td>
                  <td>{user.perfil}</td>
                  <td>{user.ultimoLogin}</td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon edit" onClick={() => handleOpenModal(user)} title="Editar">✏️</button>
                      <button className="btn-icon delete" title="Bloquear">🚫</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form className="modal-form">
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" placeholder="Ex: João Silva" defaultValue={editingUser?.nome || ''} />
              </div>
              
              <div className="form-group">
                <label>E-mail Corporativo</label>
                <input type="email" placeholder="email@empresa.com" defaultValue={editingUser?.email || ''} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Setor</label>
                  <select defaultValue={editingUser?.setor || ''}>
                    <option value="">Selecione...</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Auditoria">Auditoria</option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Perfil de Acesso</label>
                  <select defaultValue={editingUser?.perfil || ''}>
                    <option value="">Selecione...</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Editor">Editor</option>
                    <option value="Visualizador">Visualizador</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button type="button" className="btn-primary">Salvar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;