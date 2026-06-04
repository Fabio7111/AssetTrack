import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import texturaParede from '../assets/fundo-verde.png';
import logoAssetTrack from '../assets/logo-assettrack.png';
import api from '../services/api';

function Login() {
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({ nome: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFeedback(null);
    if (view === 'login' || view === 'cadastro') {
      setFormData({ nome: '', email: '', password: '', confirmPassword: '' });
    } else if (view === 'recuperar_senha') {
      setFormData((prev) => ({
        nome: prev.nome,
        email: prev.email,
        password: '',
        confirmPassword: ''
      }));
    }
  }, [view]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (view === 'cadastro' || view === 'recuperar_senha') {
      if (formData.password !== formData.confirmPassword) {
        setFeedback({ type: 'error', text: 'As senhas não coincidem!' });
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setFeedback({
          type: 'error',
          text: 'A senha deve ter no mínimo 8 caracteres, contendo letra maiúscula, minúscula, número e símbolo (ex: @, #, !).'
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      if (view === 'login') {
        const response = await api.post('/auth/login', {
          email: formData.email,
          senha: formData.password
        });
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }

      else if (view === 'cadastro') {
        const requestData = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.password
        };

        await api.post('/usuarios/solicitar-acesso', requestData);

        setFeedback({ type: 'success', text: 'Cadastro realizado com sucesso!' });
        setTimeout(() => setView('login'), 2000);
      }

      else if (view === 'recuperar_email') {
        await api.get(`/usuarios/verificar-email?email=${formData.email}`);

        setFeedback({ type: 'success', text: 'E-mail localizado! Insira a sua nova senha.' });
        setTimeout(() => setView('recuperar_senha'), 2000);
      }

      else if (view === 'recuperar_senha') {
        await api.post('/usuarios/recuperar-senha', {
          email: formData.email,
          novaSenha: formData.password
        });

        setFeedback({ type: 'success', text: 'Senha alterada com sucesso!' });
        setTimeout(() => setView('login'), 2000);
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao processar: verifique seus dados ou conexão.';
      setFeedback({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="login-split-container">

        <div className="login-form-section">
          <div className="login-header">
            <h2>
              {view === 'login' ? 'Já possui acesso?' :
                  view === 'cadastro' ? 'Novo por aqui?' : 'Recuperar Acesso'}
            </h2>
            <p>
              {view === 'login' ? 'Faça seu login e acesse o sistema.' :
                  view === 'cadastro' ? 'Preencha os dados para solicitar acesso.' : 'Siga os passos para redefinir sua senha.'}
            </p>
          </div>

          {feedback && (
              <div className={`message-box msg-${feedback.type}`}>
                {feedback.text}
              </div>
          )}

          <form onSubmit={handleAction} className="login-form">
            {view === 'cadastro' && (
                <div className="input-group">
                  <label>Nome Completo</label>
                  <input name="nome" type="text" value={formData.nome} onChange={handleInputChange} required />
                </div>
            )}

            {view !== 'recuperar_senha' && (
                <div className="input-group">
                  <label>E-mail Corporativo</label>
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
            )}

            {(view === 'login' || view === 'cadastro' || view === 'recuperar_senha') && (
                <div className="input-group">
                  <label>{view === 'recuperar_senha' ? 'Nova Senha' : 'Senha'}</label>
                  <input name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                </div>
            )}

            {(view === 'cadastro' || view === 'recuperar_senha') && (
                <div className="input-group">
                  <label>Confirmar Senha</label>
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>
            )}

            {view === 'login' ? (
                <button type="button" className="btn-esqueci-senha" onClick={() => setView('recuperar_email')}>
                  Esqueci minha senha
                </button>
            ) : view === 'recuperar_email' || view === 'recuperar_senha' ? (
                <button type="button" className="btn-esqueci-senha" onClick={() => setView('login')}>
                  Voltar ao Login
                </button>
            ) : null}

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? 'Processando...' :
                  view === 'login' ? 'Entrar' :
                      view === 'recuperar_email' ? 'Enviar link' : 'Confirmar'}
            </button>
          </form>
        </div>

        <div className="login-banner-section" style={{ backgroundImage: `url(${texturaParede})` }}>

          <img src={String(logoAssetTrack)} alt="AssetTrack Logo" className="banner-logo" />

          <div className="banner-cta">
            <p>{view === 'cadastro' ? 'Já possui uma conta?' : 'Ainda não tem acesso ao sistema?'}</p>
            <button
                className="btn-outline"
                onClick={() => setView(view === 'cadastro' ? 'login' : 'cadastro')}
            >
              {view === 'cadastro' ? 'Fazer login' : 'Solicitar acesso'}
            </button>
          </div>
        </div>

      </div>
  );
}

export default Login;