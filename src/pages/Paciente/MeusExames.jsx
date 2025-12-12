import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { api } from '../../services/api';

export default function MeusExames() {
  useAuth();
  const [exames, setExames] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [exameSelecionado, setExameSelecionado] = useState(null);

  useEffect(() => {
    const init = async () => {
      await carregarExames();
    };
    init();
  }, []);

  const carregarExames = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pacientes/meu/exames');
      const data = response.data;
      
      // Formatar exames vindos da API
      const examesFormatados = data.map((exame) => {
        const resultadoObj = exame.resultado ? JSON.parse(exame.resultado) : null;
        const statusMap = {
          'solicitado': 'Aguardando',
          'realizado': 'Concluído',
          'cancelado': 'Cancelado'
        };
        
        return {
          id: exame.id,
          tipo: exame.tipoExame,
          dataSolicitacao: exame.dataSolicitacao?.split('T')[0],
          dataResultado: exame.dataRealizacao?.split('T')[0] || null,
          medicoSolicitante: exame.medicoNome || 'Médico não informado',
          unidade: exame.unidadeNome || 'Unidade não informada',
          status: statusMap[exame.status] || exame.status,
          resultado: resultadoObj?.resumo || exame.descricao || 'Aguardando resultado',
          observacoes: exame.descricao || '',
          parametros: resultadoObj?.parametros || []
        };
      });
      
      setExames(examesFormatados);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  const examesFiltrados = exames.filter(exame => {
    const matchFiltro = 
      exame.tipo.toLowerCase().includes(filtro.toLowerCase()) ||
      exame.medicoSolicitante.toLowerCase().includes(filtro.toLowerCase());
    
    const matchTipo = filtroTipo === 'todos' || exame.status === filtroTipo;
    
    return matchFiltro && matchTipo;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aguardando': return '#00A8A1';
      case 'Concluído': return '#006F6A';
      case 'Cancelado': return '#D9D9D9';
      default: return '#5A5A5A';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aguardando': return '⏳';
      case 'Concluído': return '✅';
      case 'Cancelado': return '❌';
      default: return '📋';
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#006F6A',
            marginBottom: '8px'
          }}>
            🔬 Meus Exames
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            Histórico de exames laboratoriais e resultados
          </p>
        </div>

        {/* Estatísticas */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#009688' }}>
              {exames.length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Total de Exames
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00A8A1' }}>
              {exames.filter(e => e.status === 'Aguardando').length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Aguardando Resultado
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#006F6A' }}>
              {exames.filter(e => e.status === 'Concluído').length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Concluídos
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <input
              type="text"
              placeholder="Buscar por tipo de exame ou médico..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #D9D9D9',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #D9D9D9',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="todos">Todos os Status</option>
              <option value="Aguardando">Aguardando</option>
              <option value="Concluído">Concluídos</option>
              <option value="Cancelado">Cancelados</option>
            </select>
          </div>
        </div>

        {/* Lista de Exames */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#5A5A5A' }}>
            Carregando exames...
          </div>
        ) : examesFiltrados.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
              Nenhum exame encontrado
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {examesFiltrados.map((exame) => (
              <div
                key={exame.id}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: exame.status === 'Concluído' ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  border: '2px solid transparent'
                }}
                onClick={() => exame.status === 'Concluído' && setExameSelecionado(exame)}
                onMouseEnter={(e) => {
                  if (exame.status === 'Concluído') {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,150,136,0.15)';
                    e.currentTarget.style.borderColor = '#17C4C1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '32px' }}>
                        {getStatusIcon(exame.status)}
                      </span>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: '600', 
                            color: '#006F6A',
                            margin: 0
                          }}>
                            {exame.tipo}
                          </h3>
                          <span style={{
                            backgroundColor: getStatusColor(exame.status),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {exame.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      color: '#5A5A5A',
                      fontSize: '14px'
                    }}>
                      <div>
                        <strong>📅 Solicitado em:</strong><br />
                        {new Date(exame.dataSolicitacao).toLocaleDateString('pt-BR')}
                      </div>
                      {exame.dataResultado && (
                        <div>
                          <strong>✅ Resultado em:</strong><br />
                          {new Date(exame.dataResultado).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      <div>
                        <strong>👨‍⚕️ Solicitante:</strong><br />
                        {exame.medicoSolicitante}
                      </div>
                      <div>
                        <strong>🏥 Unidade:</strong><br />
                        {exame.unidade}
                      </div>
                    </div>
                    
                    {exame.resultado && (
                      <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#E6F9FF',
                        borderRadius: '8px'
                      }}>
                        <div style={{ color: '#006F6A', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                          Resultado:
                        </div>
                        <div style={{ color: '#5A5A5A', fontSize: '14px', fontWeight: '500' }}>
                          {exame.resultado}
                        </div>
                      </div>
                    )}
                    
                    {exame.observacoes && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#fff3cd',
                        borderRadius: '8px',
                        border: '1px solid #ffc107'
                      }}>
                        <div style={{ color: '#856404', fontSize: '13px' }}>
                          ℹ️ {exame.observacoes}
                        </div>
                      </div>
                    )}
                    
                    {exame.status === 'Concluído' && (
                      <div style={{ marginTop: '12px', color: '#009688', fontSize: '14px', fontWeight: '500' }}>
                        Clique para ver detalhes completos →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalhes do Exame */}
        {exameSelecionado && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setExameSelecionado(null)}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '32px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#006F6A', margin: 0 }}>
                  {exameSelecionado.tipo}
                </h2>
                <button
                  onClick={() => setExameSelecionado(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#5A5A5A'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E6F9FF' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#5A5A5A' }}>Data da Solicitação:</span><br />
                    <strong>{new Date(exameSelecionado.dataSolicitacao).toLocaleDateString('pt-BR')}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#5A5A5A' }}>Data do Resultado:</span><br />
                    <strong>{new Date(exameSelecionado.dataResultado).toLocaleDateString('pt-BR')}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#5A5A5A' }}>Médico Solicitante:</span><br />
                    <strong>{exameSelecionado.medicoSolicitante}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#5A5A5A' }}>Unidade:</span><br />
                    <strong>{exameSelecionado.unidade}</strong>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#006F6A', marginBottom: '12px' }}>
                  Resultado Geral
                </h3>
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#E6F9FF', 
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#006F6A',
                  fontWeight: '500'
                }}>
                  {exameSelecionado.resultado}
                </div>
              </div>
              
              {exameSelecionado.parametros && exameSelecionado.parametros.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#006F6A', marginBottom: '12px' }}>
                    Parâmetros Detalhados
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#E6F9FF' }}>
                          <th style={{ padding: '12px', textAlign: 'left', color: '#006F6A', fontSize: '14px' }}>
                            Parâmetro
                          </th>
                          <th style={{ padding: '12px', textAlign: 'center', color: '#006F6A', fontSize: '14px' }}>
                            Valor
                          </th>
                          <th style={{ padding: '12px', textAlign: 'center', color: '#006F6A', fontSize: '14px' }}>
                            Unidade
                          </th>
                          <th style={{ padding: '12px', textAlign: 'center', color: '#006F6A', fontSize: '14px' }}>
                            Referência
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {exameSelecionado.parametros.map((param, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #E6F9FF' }}>
                            <td style={{ padding: '12px', fontSize: '14px', color: '#5A5A5A' }}>
                              {param.nome}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#006F6A' }}>
                              {param.valor}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: '#5A5A5A' }}>
                              {param.unidade}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: '#5A5A5A' }}>
                              {param.referencia}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {exameSelecionado.observacoes && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '8px',
                  border: '1px solid #ffc107'
                }}>
                  <div style={{ color: '#856404', fontSize: '14px' }}>
                    <strong>Observações:</strong><br />
                    {exameSelecionado.observacoes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
