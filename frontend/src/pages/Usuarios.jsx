import React, { useState, useEffect } from 'react';
import './Usuarios.css';
import api from '../services/api';
import imagemFundo from '../assets/fundo-usuários.png';

function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Estado para os campos do formulário
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', idPerfil: '' });

  useEffect(() => {
    fetchUsers();
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

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setFormData(user ? { nome: user.nome, email: user.email, idPerfil: user.idPerfil } : { nome: '', email: '', senha: '', idPerfil: '' });
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/usuarios/${editingUser.id}`, formData);
      } else {
        await api.post('/usuarios', formData);
      }
      handleCloseModal();
      fetchUsers(); // Atualiza a lista após salvar
    } catch (error) {
      alert("Erro ao salvar usuário: " + (error.response?.data?.message || "Verifique os dados."));
    }
  };

  const handleBloquear = async (id) => {
    if (window.confirm("Deseja realmente inativar este usuário?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        fetchUsers();
      } catch (error) {
        alert("Erro ao inativar usuário.");
      }
    }
  };

  if (loading) return <div className="dashboard-loading">Carregando usuários...</div>;

  return (
      <div className="usuarios-container">
        <header className="usuarios-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
          <div className="header-content">
            <h1>Gestão de Usuários</h1>
            <button className="btn-primary" onClick={() => handleOpenModal()}>+ Novo Usuário</button>
          </div>
        </header>

        <section className="table-section">
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
            {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td>{user.nomePerfil}</td>
                  <td><span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span></td>
                  <td>
                    <button className="btn-icon" onClick={() => handleOpenModal(user)}>✏️</button>
                    <button className="btn-icon" onClick={() => handleBloquear(user.id)}>🚫</button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </section>

        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                <form onSubmit={handleSaveUser}>
                  <input type="text" placeholder="Nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                  <input type="email" placeholder="E-mail" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  {!editingUser && (
                      <input type="password" placeholder="Senha" onChange={e => setFormData({...formData, senha: e.target.value})} required />
                  )}
                  <select value={formData.idPerfil} onChange={e => setFormData({...formData, idPerfil: e.target.value})} required>
                    <option value="">Selecione o Perfil</option>
                  </select>
                  <button type="submit" className="btn-primary">Salvar</button>
                  <button type="button" onClick={handleCloseModal}>Cancelar</button>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}

export default Usuarios;