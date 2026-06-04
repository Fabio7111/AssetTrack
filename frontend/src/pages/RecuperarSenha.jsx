import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Login.css';

function RecuperarSenha() {
    const [step, setStep] = useState(1); // 1: E-mail, 2: Nova Senha
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleEnviar = (e) => {
        e.preventDefault();
        setStep(2);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{step === 1 ? 'Recuperar Acesso' : 'Redefinir Senha'}</h2>
                <form onSubmit={step === 1 ? handleEnviar : () => navigate('/login')}>
                    {step === 1 ? (
                        <div className="input-group">
                            <label>E-mail Corporativo</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    ) : (
                        <>
                            <div className="input-group">
                                <label>Nova Senha</label>
                                <input type="password" required />
                            </div>
                            <div className="input-group">
                                <label>Confirmar Nova Senha</label>
                                <input type="password" required />
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn-login">{step === 1 ? 'Enviar Link' : 'Confirmar'}</button>
                </form>
                <button onClick={() => navigate('/login')} className="btn-secondary" style={{marginTop: '10px'}}>Voltar ao Login</button>
            </div>
        </div>
    );
}
export default RecuperarSenha;