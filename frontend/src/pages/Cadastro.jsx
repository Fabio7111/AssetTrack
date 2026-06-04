import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Login.css';

function Cadastro() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Primeiro Acesso</h2>
                <form className="login-form">
                    <div className="input-group"><label>Nome Completo</label><input type="text" required /></div>
                    <div className="input-group"><label>E-mail Corporativo</label><input type="email" required /></div>
                    <div className="input-group"><label>Senha</label><input type="password" required /></div>
                    <div className="input-group"><label>Confirmar Senha</label><input type="password" required /></div>
                    <button type="submit" className="btn-login">Confirmar Cadastro</button>
                </form>
                <button onClick={() => navigate('/login')} className="btn-secondary" style={{marginTop: '10px'}}>Voltar ao Login</button>
            </div>
        </div>
    );
}
export default Cadastro;