import React, { useState, useEffect } from 'react';
import './Usuarios.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-usuários.png';

import detalhesIcon from '../assets/Detalhes Icon.png';
import editarIcon from '../assets/Editar Icon.png';
import excluirIcon from '../assets/Excluir Icon.png';

function Usuarios() {
  const [users, setUsers] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPerfil, setFilterPerfil] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', idPerfil: '' });

  useEffect(() => {
    fetchUsers();
    fetchPerfis();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerfis = async () => {
    try {
      const response = await api.get('/perfis');
      setPerfis(response.data);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPerfil = filterPerfil ? user.nomePerfil === filterPerfil : true;
    const matchesStatus = filterStatus ? user.status === filterStatus : true;

    return matchesSearch && matchesPerfil && matchesStatus;
  });

  // --- Função para Exportar para Excel ---
  const exportToExcel = () => {
    const headers = ['Nome', 'E-mail', 'Perfil', 'Status'];

    const csvRows = filteredUsers.map(user => [
      user.nome,
      user.email,
      user.nomePerfil,
      user.status
    ].map(val => `"${val}"`).join(','));

    const csvContent = "\uFEFF" + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_usuarios.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenModal = (user = null) => {
    const isEdit = user && user.id;

    setEditingUser(isEdit ? user : null);

    let idPerfilEncontrado = '';
    if (isEdit && perfis.length > 0) {
      const perfilMatch = perfis.find(p => {
        const nomeP = p.nomePerfil || p.nome_perfil || p.nome;
        return nomeP === user.nomePerfil;
      });
      if (perfilMatch) idPerfilEncontrado = perfilMatch.id || perfilMatch.idPerfil;
    }

    setFormData(isEdit ?
        { nome: user.nome || '', email: user.email || '', senha: '', idPerfil: idPerfilEncontrado } :
        { nome: '', email: '', senha: '', idPerfil: '' }
    );

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ nome: '', email: '', senha: '', idPerfil: '' });
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = { ...formData };

      if (editingUser) {
        if (dataToUpdate.senha && editingUser.status === 'INATIVO') {
          dataToUpdate.status = 'ATIVO'; // Força a ativação
        } else {
          dataToUpdate.status = editingUser.status;
        }

        if (!dataToUpdate.senha) delete dataToUpdate.senha;

        console.log("Enviando dados para PUT:", dataToUpdate);
        await api.put(`/usuarios/${editingUser.id}`, dataToUpdate);
      } else {
        // Novo usuário sempre começa ativo
        dataToUpdate.status = 'ATIVO';
        await api.post('/usuarios', dataToUpdate);
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      alert("Erro ao salvar usuário: " + (error.response?.data?.message || "Verifique os dados."));
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/usuarios/${selectedUser.id}`);
      fetchUsers();
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      alert("Erro ao inativar usuário.");
    }
  };

  if (loading) return <div className="dashboard-loading">Carregando usuários...</div>;

  return (
      <div className="usuarios-container">

        <header className="usuarios-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <div>
              <h1>Gestão de Usuários</h1>
              <p>Gerencie os acessos e permissões dos colaboradores.</p>
            </div>
            <button className="btn-primary" onClick={() => handleOpenModal(null)}>+ Novo Usuário</button>
          </div>
        </header>

        <div className="filters-container">
          <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="filter-input-search"
          />
          <select value={filterPerfil} onChange={e => setFilterPerfil(e.target.value)} className="filter-select">
            <option value="">Todos os Perfis</option>
            {perfis.map((p, index) => {
              const nomeP = p.nomePerfil || p.nome_perfil || p.nome;
              return <option key={p.id || index} value={nomeP}>{nomeP}</option>;
            })}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">Todos os Status</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>

        <section className="table-section">
          <div className="table-header">
            <h2>Gerenciamento de Usuários</h2>
            <button className="btn-secondary" onClick={exportToExcel}>Exportar para Excel</button>
          </div>

          <table className="custom-table">
            <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nome}</td>
                      <td>{user.email}</td>
                      <td>{user.nomePerfil}</td>
                      <td><span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span></td>
                      <td className="action-buttons">
                        <button className="btn-icon" onClick={() => openViewModal(user)} title="Detalhes">
                          <img src={detalhesIcon} alt="Detalhes" className="action-icon" />
                        </button>
                        <button className="btn-icon" onClick={() => handleOpenModal(user)} title="Editar">
                          <img src={editarIcon} alt="Editar" className="action-icon" />
                        </button>
                        <button className="btn-icon" onClick={() => openDeleteModal(user)} title="Excluir">
                          <img src={excluirIcon} alt="Excluir" className="action-icon" />
                        </button>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    Nenhum usuário encontrado com esses filtros.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </section>

        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                  <button className="btn-close" onClick={handleCloseModal}>&times;</button>
                </div>

                <form className="modal-form" onSubmit={handleSaveUser}>
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                  </div>

                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                        autoComplete="off"
                    />
                  </div>

                  <div className="form-group">
                    <label>{editingUser ? 'Nova Senha' : 'Senha'}</label>
                    <input
                        type="password"
                        value={formData.senha}
                        onChange={e => setFormData({...formData, senha: e.target.value})}
                        required={!editingUser}
                        autoComplete="new-password"
                    />
                  </div>

                  <div className="form-group">
                    <label>Perfil de Acesso</label>
                    <select value={formData.idPerfil} onChange={e => setFormData({...formData, idPerfil: e.target.value})} required>
                      <option value="">Selecione o Perfil</option>
                      {perfis.map((p, index) => {
                        const idP = p.id || p.idPerfil;
                        const nomeP = p.nomePerfil || p.nome_perfil || p.nome;
                        return <option key={idP || index} value={idP}>{nomeP}</option>;
                      })}
                    </select>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                    <button type="submit" className="btn-primary">Salvar Usuário</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {viewModalOpen && selectedUser && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Detalhes do Usuário</h2>
                  <button className="btn-close" onClick={() => setViewModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <div className="form-group">
                    <label>ID do Usuário</label>
                    <input type="text" value={selectedUser.id} disabled />
                  </div>
                  <div className="form-group">
                    <label>Nome</label>
                    <input type="text" value={selectedUser.nome} disabled />
                  </div>
                  <div className="form-group">
                    <label>E-mail</label>
                    <input type="email" value={selectedUser.email} disabled />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Perfil</label>
                      <input type="text" value={selectedUser.nomePerfil} disabled />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <input type="text" value={selectedUser.status} disabled />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setViewModalOpen(false)}>
                    Fechar
                  </button>
                </div>
              </div>
            </div>
        )}

        {deleteModalOpen && selectedUser && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Confirmar Inativação</h2>
                  <button className="btn-close" onClick={() => setDeleteModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-form">
                  <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>
                    Tem certeza que deseja inativar o usuário <strong>{selectedUser.nome}</strong>? Ele perderá o acesso ao sistema.
                  </p>
                </div>
                <div className="modal-footer" style={{ padding: '20px 25px' }}>
                  <button className="btn-secondary" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
                  <button className="btn-primary" style={{ backgroundColor: '#e74c3c', color: 'white' }} onClick={confirmDelete}>Inativar Usuário</button>
                </div>
              </div>
            </div>
        )}

      </div>
  );
}

export default Usuarios;