import React, { useEffect, useState } from 'react';
import './Relatorios.css';
import imagemFundo from '../assets/fundo-relat.png';
import api from '../services/api';

function Relatorios() {

  const [equipamentos, setEquipamentos] = useState([]);
  const [mostrarTabela, setMostrarTabela] = useState(false);
  const [status, setStatus] = useState('todos');
  const [setor, setSetor] = useState('todos');
  const [setores, setSetores] = useState([]);


useEffect(() => {
  carregarSetores();
}, []);

async function carregarSetores() {

  try {

    const response = await api.get('/setores');

    setSetores(response.data);

  } catch (error) {

    console.log(error);

  }

}

async function carregarEquipamentos() {

  try {

    const response = await api.get('/relatorios/equipamentos', {
      params: {
        status,
        setor
      }
    });

    setEquipamentos(response.data);
    setMostrarTabela(true);

  } catch (error) {

    console.log("Erro completo:", error);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Dados:", error.response.data);
    }

    alert("Erro ao carregar relatório.");
  }

}
async function exportarExcelEquipamentos() {

  try {

    const response = await api.get(
      '/relatorios/equipamentos/excel',
      {
        responseType: 'blob'
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement('a');

    link.href = url;
    link.setAttribute(
      'download',
      'equipamentos.xlsx'
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

    alert("Erro ao exportar Excel.");

  }

}

async function exportarPdfEquipamentos() {

  try {

    const response = await api.get(
      '/relatorios/equipamentos/pdf',
      {
        responseType: 'blob'
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: 'application/pdf'
      })
    );

    const link = document.createElement('a');

    link.href = url;
    link.setAttribute(
      'download',
      'equipamentos.pdf'
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

    alert("Erro ao exportar PDF.");

  }

}

async function exportarExcelManutencoes() {

  try {

    const response = await api.get(
      '/relatorios/manutencoes/excel',
      {
        responseType: 'blob'
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement('a');

    link.href = url;
    link.setAttribute(
      'download',
      'manutencoes.xlsx'
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

    alert("Erro ao exportar Excel.");

  }

}

async function exportarPdfManutencoes() {

  try {

    const response = await api.get(
      '/relatorios/manutencoes/pdf',
      {
        responseType: 'blob'
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: 'application/pdf'
      })
    );

    const link = document.createElement('a');

    link.href = url;
    link.setAttribute(
      'download',
      'manutencoes.pdf'
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

    alert("Erro ao exportar PDF.");

  }

}

async function exportarExcelMovimentacoes() {

  try {

    const response = await api.get(
      '/relatorios/movimentacoes/excel',
      {
        responseType: 'blob'
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement('a');

    link.href = url;
    link.setAttribute(
      'download',
      'movimentacoes.xlsx'
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

    alert("Erro ao exportar Excel.");

  }

}

async function exportarPdfMovimentacoes() {

  try {

    const response = await api.get(
      '/relatorios/movimentacoes/pdf',
      {
        responseType: 'blob'
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: 'application/pdf'
      })
    );

    const link = document.createElement('a');

    link.href = url;
    link.setAttribute(
      'download',
      'movimentacoes.pdf'
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

    alert("Erro ao exportar PDF.");

  }

}

  const handleExport = (relatorio, formato) => {

    alert(
      `A processar...\nA gerar o ${relatorio} no formato ${formato}. Este ficheiro seria descarregado automaticamente.`
    );

  };

  return (
    <div className="relatorios-container">

      <header
        className="relatorios-header"
        style={{ '--bg-banner': `url(${imagemFundo})` }}
      >
        <div className="header-content">
          <div>
            <h1>📊 Central de Relatórios</h1>
            <p>Gere, exporte e analise os dados de equipamentos, manutenções e alocações.</p>
          </div>
        </div>
      </header>

      <section className="reports-grid">

        <div className="report-builder-card">

          <div className="report-header">
            <div className="report-icon">💻</div>
            <div>
              <h3>Relatório de Equipamentos</h3>
              <p>Relatório detalhado de todos os equipamentos cadastrados no sistema.</p>
            </div>
          </div>

<div className="report-filters">

  <div className="filter-group">

    <label>Status</label>

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="todos">Todos os Status</option>
      <option value="ATIVO">Ativo</option>
      <option value="INATIVO">Inativo</option>
      <option value="MANUTENCAO">Em Manutenção</option>
    </select>

  </div>

  <div className="filter-group">

    <label>Setor</label>

    <select
      value={setor}
      onChange={(e) => setSetor(e.target.value)}
    >
      <option value="todos">Todos os Setores</option>

      {setores.map((s) => (

        <option
          key={s.idSetor}
          value={s.nomeSetor}
        >
          {s.nomeSetor}
        </option>

      ))}

    </select>

  </div>

</div>

          <div className="report-actions">

            <button
              className="btn-export pdf"
              onClick={exportarPdfEquipamentos}
            >
              📄 Gerar PDF
            </button>

           <button
             className="btn-export excel"
             onClick={exportarExcelEquipamentos}
           >
             📊 Exportar Excel
           </button>

          </div>

        </div>

        <div className="report-builder-card">

          <div className="report-header">
            <div className="report-icon">🛠️</div>
            <div>
              <h3>Histórico de Manutenções</h3>
              <p>Histórico completo de manutenções preventivas e corretivas.</p>
            </div>
          </div>

          <div className="report-filters">

            <div className="filter-group date-group">

              <label>Período (Início e Fim)</label>

              <div className="date-inputs">
                <input type="date" className="date-input" />
                <span>até</span>
                <input type="date" className="date-input" />
              </div>

            </div>

          </div>

          <div className="report-actions mt-auto">

            <button
              className="btn-export pdf"
              onClick={exportarPdfManutencoes}
            >
              📄 Gerar PDF
            </button>

            <button
              className="btn-export excel"
             onClick={exportarExcelManutencoes}
            >
              📊 Exportar Excel
            </button>

          </div>

        </div>

        <div className="report-builder-card">

          <div className="report-header">
            <div className="report-icon">🔄</div>
            <div>
              <h3>Movimentação e Reservas</h3>
              <p>Relatório de todas as movimentações de equipamentos entre setores.</p>
            </div>
          </div>

          <div className="report-filters">

            <div className="filter-group">

              <label>Setor</label>

              <select>
                <option value="todos">
                  Todos os Setores
                </option>

                {setores.map((s) => (

                  <option
                    key={s.idSetor}
                    value={s.nomeSetor}
                  >
                    {s.nomeSetor}
                  </option>

                ))}
              </select>g

            </div>

            <div className="filter-group date-group">

              <label>Período (Início e Fim)</label>

              <div className="date-inputs">
                <input type="date" className="date-input" />
                <span>até</span>
                <input type="date" className="date-input" />
              </div>

            </div>

          </div>

          <div className="report-actions">

            <button
              className="btn-export pdf"
              onClick={exportarPdfMovimentacoes}
            >
              📄 Gerar PDF
            </button>

            <button
              className="btn-export excel"
              onClick={exportarExcelMovimentacoes}
            >
              📊 Exportar Excel
            </button>

          </div>

        </div>

      </section>

      {mostrarTabela && (

        <div className="report-builder-card">

          <div className="report-header">

            <div className="report-icon">
              📋
            </div>

            <div>
              <h3>Equipamentos Encontrados</h3>
              <p>Resultado da consulta.</p>
            </div>

          </div>

          <div className="report-actions">

            <button
              className="btn-export"
              onClick={() => {

                setMostrarTabela(false);
                setEquipamentos([]);

              }}
            >
              ❌ Fechar Visualização
            </button>

          </div>

          <table className="report-table">

            <thead>

              <tr>
                <th>Nome</th>
                <th>Nº Série</th>
                <th>Status</th>
                <th>Setor</th>
              </tr>

            </thead>

            <tbody>

              {equipamentos.map((equipamento) => (

                <tr key={equipamento.idEquipamento}>

                  <td>{equipamento.nomeEquipamento}</td>

                  <td>{equipamento.numeroSerie}</td>

                  <td>{equipamento.statusAtual}</td>

                  <td>{equipamento.nomeSetor}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Relatorios;