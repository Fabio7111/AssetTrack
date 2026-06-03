import React, { useState, useEffect } from 'react';
import './Estoque.css';
import imagemFundo from '../assets/fundo-estoque.png';

function Estoque() {
  const [itensEstoque, setItensEstoque] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstoque = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const mockEstoque = [
          { id: 1, item: 'Cabo de Rede CAT6 (Caixa 305m)', categoria: 'Infraestrutura', qtd: 2, localizacao: 'Almoxarifado TI', status: 'Disponível', imagem: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400' },
          { id: 2, item: 'Mouse Sem Fio Dell MS3320W', categoria: 'Periféricos', qtd: 14, localizacao: 'Armário A - Gav. 2', status: 'Disponível', imagem: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400' },
          { id: 3, item: 'SSD SATA Kingston 480GB', categoria: 'Hardware', qtd: 3, localizacao: 'Cofre TI', status: 'Baixo Estoque', imagem: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&q=80&w=400' },
          { id: 4, item: 'Toner Impressora Brother', categoria: 'Suprimentos', qtd: 0, localizacao: 'Prateleira 1', status: 'Esgotado', imagem: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=400' },
          { id: 5, item: 'Adaptador USB-C para HDMI', categoria: 'Acessórios', qtd: 8, localizacao: 'Armário B', status: 'Disponível', imagem: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=400' },
          { id: 6, item: 'Teclado Mecânico Logitech', categoria: 'Periféricos', qtd: 5, localizacao: 'Armário A - Gav. 1', status: 'Disponível', imagem: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400' }
        ];
        
        setItensEstoque(mockEstoque);
      } catch (error) {
        console.error("Erro ao buscar estoque:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstoque();
  }, []);

  const handleCardClick = (itemName) => {
    alert(`Em breve: Tela de detalhes aberta para o item "${itemName}". Aqui você verá histórico de entradas/saídas e fornecedores.`);
  };

  if (loading) {
    return <div className="dashboard-loading">Carregando métricas do sistema...</div>;
  }

  return (
    <div className="estoque-container">
      
      <header className="estoque-header" style={{ '--bg-banner': `url(${imagemFundo})` }}>
        <div className="header-content">
          <div>
            <h1>📦 Catálogo de Estoque</h1>
            <p>Controlo visual de quantidades de consumíveis, peças e periféricos.</p>
          </div>
          <button className="btn-primary">
            + Nova Entrada / Saída
          </button>
        </div>
      </header>

      <section className="metrics-grid estoque-metrics">
        <div className="metric-card highlight">
          <div className="metric-icon">📊</div>
          <div className="metric-info">
            <h3>Itens no Estoque</h3>
            <div className="value-box">
              <span className="metric-value dark-box">1.452</span>
            </div>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">📝</div>
          <div className="metric-info">
            <h3>Solicitações Pendentes</h3>
            <div className="value-box">
              <span className="metric-value dark-box">08</span>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-section">
        <div className="catalog-header">
          <h2>Catálogo de Itens</h2>
          <div className="catalog-actions">
            <input type="text" placeholder="Buscar por nome ou categoria..." className="search-catalog" />
          </div>
        </div>

        <div className="catalog-grid">
          {itensEstoque.map((item) => (
            <div className="item-card" key={item.id} onClick={() => handleCardClick(item.item)}>
              {/* Imagem do Item com Badge Flutuante */}
              <div className="item-image-wrapper" style={{ backgroundImage: `url(${item.imagem})` }}>
                <span className={`status-badge floating ${item.status.toLowerCase().replace(' ', '-')}`}>
                  {item.status}
                </span>
              </div>
              
              {/* Corpo do Cartão */}
              <div className="item-card-body">
                <span className="item-category">{item.categoria}</span>
                <h4 className="item-title" title={item.item}>{item.item}</h4>
                
                <div className="item-meta">
                  <div className={`item-qtd ${item.qtd === 0 ? 'text-danger' : ''}`}>
                    <strong>{item.qtd}</strong> <span>unid.</span>
                  </div>
                  <div className="item-location">
                    📍 {item.localizacao}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Estoque;