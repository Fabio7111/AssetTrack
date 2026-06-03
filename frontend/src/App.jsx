import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function InternalLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main 
        className="main-content" 
        style={{ 
          marginLeft: isSidebarOpen ? '250px' : '70px',
          width: isSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 70px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Topbar />
        
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          //<PrivateRoute>
            <InternalLayout>
              <Dashboard />
            </InternalLayout>
          //</PrivateRoute>
        } />

        <Route path="/usuarios" element={
          //<PrivateRoute>
            <InternalLayout>
              <Usuarios />
            </InternalLayout>
          //</PrivateRoute>
        } />

        <Route path="/equipamentos" element={
          //<PrivateRoute>
            <InternalLayout>
              <Equipamentos />
            </InternalLayout>
          //</PrivateRoute>
        } />

        <Route path="/aquisicao" element={
          // <PrivateRoute>
            <InternalLayout>
              <Aquisicoes />
            </InternalLayout>
          // </PrivateRoute>
        } />
        
        <Route path="/manutencao" element={
            // <PrivateRoute>
              <InternalLayout>
                <Manutencoes />
              </InternalLayout>
            // </PrivateRoute>
        } />

        <Route path="/movimentacao" element={
            // <PrivateRoute>
              <InternalLayout>
                <Movimentacao />
              </InternalLayout>
            // </PrivateRoute>
          } />
          
          <Route path="/estoque" element={
            // <PrivateRoute>
              <InternalLayout>
                <Estoque />
              </InternalLayout>
            // </PrivateRoute>
          } />

          <Route path="/solicitacoes" element={
          // <PrivateRoute>
            <InternalLayout>
              <Solicitacoes />
            </InternalLayout>
          // </PrivateRoute>
          } />

          <Route path="/auditoria" element={
          // <PrivateRoute>
            <InternalLayout>
              <Auditoria />
            </InternalLayout>
          // </PrivateRoute>
          } />

          <Route path="/relatorios" element={
          // <PrivateRoute>
            <InternalLayout>
              <Relatorios />
            </InternalLayout>
          // </PrivateRoute>
          } />

          <Route path="/configuracoes" element={
          // <PrivateRoute>
            <InternalLayout>
              <Configuracoes />
            </InternalLayout>
          // </PrivateRoute>
          } />

          <Route path="/perfil" element={
          // <PrivateRoute>
            <InternalLayout>
              <Perfil />
            </InternalLayout>
          // </PrivateRoute>
          } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;