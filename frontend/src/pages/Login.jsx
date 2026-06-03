import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

import texturaParede from '../assets/fundo-verde.png'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
      if (email === '' || password === '') {
        throw new Error('Preencha todos os campos.');
      }
      
      const token = "token-falso-assettrack-12345"; 

      localStorage.setItem('token', token);
      navigate('/'); 
      
    } catch (err) {
      setError('Credenciais inválidas. Verifique o e-mail e a senha.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ '--bg-textura': `url(${texturaParede})` }}>
      <div className="login-card">
        
        <div className="login-header">
          <h2>AssetTrack</h2>
          <h4>Sistema de Gestão de Equipamentos</h4>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>E-mail Corporativo</label>
            <input 
              type="email" 
              placeholder="Ex: nata@assettrack.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;