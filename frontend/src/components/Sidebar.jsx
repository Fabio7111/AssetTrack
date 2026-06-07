import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Sidebar.css';

import logoAssetTrack from '../assets/logo-assettrack.png';
import logoUnimed from '../assets/logo-unimed.png';
import marcaAssetTrack from '../assets/marca.png';

import iconUsu from '../assets/Usuários Icon.png';
import iconEquip from '../assets/Equip Icon.png';
import iconAqus from '../assets/Aqus Icon.png';
import iconManut from '../assets/Manut Icon.png';
import iconInv from '../assets/Inv Icon.png';
import iconMovim from '../assets/Movim Icon.png';
import iconEstoque from '../assets/Etq Icon.png';
import iconAudit from '../assets/Audit Icon.png';
import iconRelat from '../assets/Relat Icon.png';
import iconConfig from '../assets/Config Icon.png';
import iconSetas from '../assets/Setas Sidebar.png';

function Sidebar({ isOpen, toggleSidebar }) {

  const perfil = localStorage.getItem('perfil');

  return (
    <nav className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>

      <div className="sidebar-header">
        <Link to="/" className="logo-link" title="Ir para o Dashboard">
          {isOpen ? (
            <img
              src={logoAssetTrack}
              alt="AssetTrack Logo"
              className="logo-top"
            />
          ) : (
            <img
              src={marcaAssetTrack}
              alt="Marca AssetTrack"
              className="logo-short-img"
            />
          )}
        </Link>
      </div>

      <div className="nav-menu">

        {perfil === "ADMINISTRADOR" && (
          <NavLink to="/usuarios" className="nav-link">
            <img src={iconUsu} alt="Usuários" className="menu-icon" />
            <span className="link-text">Usuários</span>
          </NavLink>
        )}

        {["ADMINISTRADOR", "MODERADOR"].includes(perfil) && (
          <>
            <NavLink to="/equipamentos" className="nav-link">
              <img src={iconEquip} alt="Equipamentos" className="menu-icon" />
              <span className="link-text">Equipamentos</span>
            </NavLink>

            <NavLink to="/aquisicao" className="nav-link">
              <img src={iconAqus} alt="Aquisição" className="menu-icon" />
              <span className="link-text">Aquisição</span>
            </NavLink>

            <NavLink to="/manutencao" className="nav-link">
              <img src={iconManut} alt="Manutenção" className="menu-icon" />
              <span className="link-text">Manutenção</span>
            </NavLink>

            <NavLink to="/movimentacao" className="nav-link">
              <img src={iconMovim} alt="Movimentação" className="menu-icon" />
              <span className="link-text">Movimentação</span>
            </NavLink>

            <NavLink to="/estoque" className="nav-link">
              <img src={iconEstoque} alt="Estoque" className="menu-icon" />
              <span className="link-text">Estoque</span>
            </NavLink>

            <NavLink to="/relatorios" className="nav-link">
              <img src={iconRelat} alt="Relatórios" className="menu-icon" />
              <span className="link-text">Relatórios</span>
            </NavLink>
          </>
        )}

        <NavLink to="/solicitacoes" className="nav-link">
          <img src={iconInv} alt="Solicitações" className="menu-icon" />
          <span className="link-text">Solicitações</span>
        </NavLink>

        {perfil === "ADMINISTRADOR" && (
          <NavLink to="/auditoria" className="nav-link">
            <img src={iconAudit} alt="Auditoria" className="menu-icon" />
            <span className="link-text">Auditoria</span>
          </NavLink>
        )}

      </div>

      <div className="sidebar-footer">
        {isOpen && (
          <div className="unimed-container">
            <img
              src={logoUnimed}
              alt="Unimed Assis"
              className="logo-bottom"
            />
          </div>
        )}

        <div className="footer-actions">
          <NavLink
            to="/configuracoes"
            className="settings-btn"
            title="Configurações"
          >
            <img
              src={iconConfig}
              alt="Configurações"
              className="menu-icon"
            />
          </NavLink>

          <button
            className="toggle-btn"
            onClick={toggleSidebar}
            title={isOpen ? "Recolher Menu" : "Expandir Menu"}
          >
            <img
              src={iconSetas}
              alt="Alternar Menu"
              className={`arrow-icon ${!isOpen ? 'flipped' : ''}`}
            />
          </button>
        </div>
      </div>

    </nav>
  );
}

export default Sidebar;