import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Equipamentos from './pages/Equipamentos';
import Aquisicoes from './pages/Aquisicoes';
import Manutencoes from './pages/Manutencoes';
import Movimentacao from './pages/Movimentacao';
import Estoque from './pages/Estoque';
import Solicitacoes from './pages/Solicitacoes';
import Auditoria from './pages/Auditoria';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import Perfil from './pages/Perfil';

function InternalLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main
                className="main-content"
                style={{
                    marginLeft: isSidebarOpen ? '250px' : '70px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <Topbar />
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />

                {/* Rotas Protegidas (Só acessíveis se tiver token) */}
                <Route element={<PrivateRoute />}>
                    <Route element={<InternalLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/equipamentos" element={<Equipamentos />} />
                        <Route path="/aquisicao" element={<Aquisicoes />} />
                        <Route path="/manutencao" element={<Manutencoes />} />
                        <Route path="/movimentacao" element={<Movimentacao />} />
                        <Route path="/estoque" element={<Estoque />} />
                        <Route path="/solicitacoes" element={<Solicitacoes />} />
                        <Route path="/auditoria" element={<Auditoria />} />
                        <Route path="/relatorios" element={<Relatorios />} />
                        <Route path="/configuracoes" element={<Configuracoes />} />
                        <Route path="/perfil" element={<Perfil />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;