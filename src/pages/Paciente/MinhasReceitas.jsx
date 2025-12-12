import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { api } from '../../services/api';

export default function MinhasReceitas() {
  useAuth();
  const [receitas, setReceitas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);

  useEffect(() => {
    const init = async () => {
      await carregarReceitas();
    };
    init();
  }, []);

  const carregarReceitas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pacientes/meu/receitas');
      const data = response.data;
      
      // Formatar receitas vindas da API
      const receitasFormatadas = data.map((receita) => {
        const medicamentosArray = JSON.parse(receita.medicamentos || '[]');
        const dataValidade = new Date(receita.dataValidade);
        const hoje = new Date();
        const isVencida = dataValidade < hoje;
        
        return {
          id: receita.id,
          numero: `${String(receita.id).padStart(3, '0')}/2025`,
          dataEmissao: receita.criadoEm?.split('T')[0] || '',
          dataValidade: receita.dataValidade,
          medico: {
            nome: receita.medicoNome || 'Médico não informado',
            especialidade: 'Medicina',
            crm: receita.medicoCrm || 'CRM não informado'
          },
          unidade: receita.unidadeNome || 'Unidade não informada',
          status: isVencida ? 'Vencida' : 'Ativa',
          tipo: 'Simples',
          diagnostico: receita.hipoteseDiagnostica || receita.queixaPrincipal || 'Não informado',
          medicamentos: medicamentosArray.map(med => ({
            nome: med.nome || med.medicamento || 'Medicamento não especificado',
            dosagem: med.dosagem || '---',
            posologia: med.posologia || '---',
            quantidade: med.quantidade || '---',
            duracao: med.duracao || '---',
            observacoes: med.observacoes || ''
          })),
          observacoesGerais: receita.observacoes || ''
        };
      });
      
      setReceitas(receitasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const receitasFiltradas = receitas.filter(receita => {
    const matchFiltro = 
      receita.numero.toLowerCase().includes(filtro.toLowerCase()) ||
      receita.medico.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      receita.medicamentos.some(m => m.nome.toLowerCase().includes(filtro.toLowerCase()));
    
    const matchStatus = filtroStatus === 'todas' || receita.status === filtroStatus;
    
    return matchFiltro && matchStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativa': return '#006F6A';
      case 'Vencida': return '#D9D9D9';
      case 'Utilizada': return '#00A8A1';
      case 'Cancelada': return '#5A5A5A';
      default: return '#5A5A5A';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ativa': return '✅';
      case 'Vencida': return '⏰';
      case 'Utilizada': return '✔️';
      case 'Cancelada': return '❌';
      default: return '📋';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Antibiótico': return '#dc3545';
      case 'Controlado': return '#ffc107';
      case 'Simples': return '#009688';
      default: return '#5A5A5A';
    }
  };

  const handleImprimir = () => {
    // TODO: Implementar impressão real
    alert('Funcionalidade de impressão será implementada com a API');
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
            💊 Minhas Receitas
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            Receitas médicas e prescrições emitidas
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
              {receitas.length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Total de Receitas
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
              {receitas.filter(r => r.status === 'Ativa').length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Receitas Ativas
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
              {receitas.filter(r => r.status === 'Utilizada').length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Utilizadas
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
              placeholder="Buscar por número, médico ou medicamento..."
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
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #D9D9D9',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="todas">Todas as Receitas</option>
              <option value="Ativa">Ativas</option>
              <option value="Vencida">Vencidas</option>
              <option value="Utilizada">Utilizadas</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Lista de Receitas */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#5A5A5A' }}>
            Carregando receitas...
          </div>
        ) : receitasFiltradas.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
              Nenhuma receita encontrada
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {receitasFiltradas.map((receita) => (
              <div
                key={receita.id}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '2px solid transparent'
                }}
                onClick={() => setReceitaSelecionada(receita)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,150,136,0.15)';
                  e.currentTarget.style.borderColor = '#17C4C1';
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
                        {getStatusIcon(receita.status)}
                      </span>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: '600', 
                            color: '#006F6A',
                            margin: 0
                          }}>
                            Receita Nº {receita.numero}
                          </h3>
                          <span style={{
                            backgroundColor: getStatusColor(receita.status),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {receita.status}
                          </span>
                          <span style={{
                            backgroundColor: getTipoColor(receita.tipo),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {receita.tipo}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      color: '#5A5A5A',
                      fontSize: '14px',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <strong>📅 Emissão:</strong><br />
                        {new Date(receita.dataEmissao).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <strong>⏰ Validade:</strong><br />
                        {new Date(receita.dataValidade).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <strong>👨‍⚕️ Médico:</strong><br />
                        {receita.medico.nome}
                      </div>
                      <div>
                        <strong>🏥 Unidade:</strong><br />
                        {receita.unidade}
                      </div>
                    </div>
                    
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#E6F9FF',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ color: '#006F6A', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                        Diagnóstico:
                      </div>
                      <div style={{ color: '#5A5A5A', fontSize: '14px' }}>
                        {receita.diagnostico}
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#006F6A', marginBottom: '8px' }}>
                        💊 Medicamentos ({receita.medicamentos.length}):
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {receita.medicamentos.map((med, index) => (
                          <div 
                            key={index}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '6px',
                              borderLeft: '3px solid #009688'
                            }}
                          >
                            <div style={{ fontWeight: '600', color: '#006F6A', fontSize: '14px' }}>
                              {med.nome} - {med.dosagem}
                            </div>
                            <div style={{ fontSize: '13px', color: '#5A5A5A', marginTop: '2px' }}>
                              {med.posologia}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {receita.status === 'Cancelada' && receita.motivoCancelamento && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#ffe6e6',
                        borderRadius: '8px',
                        border: '1px solid #dc3545'
                      }}>
                        <div style={{ color: '#dc3545', fontSize: '13px' }}>
                          <strong>❌ Motivo do cancelamento:</strong><br />
                          {receita.motivoCancelamento}
                        </div>
                      </div>
                    )}
                    
                    <div style={{ marginTop: '12px', color: '#009688', fontSize: '14px', fontWeight: '500' }}>
                      Clique para ver detalhes completos →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalhes da Receita */}
        {receitaSelecionada && (
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
            onClick={() => setReceitaSelecionada(null)}
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
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#006F6A', margin: 0 }}>
                    Receita Médica Nº {receitaSelecionada.numero}
                  </h2>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <span style={{
                      backgroundColor: getStatusColor(receitaSelecionada.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {receitaSelecionada.status}
                    </span>
                    <span style={{
                      backgroundColor: getTipoColor(receitaSelecionada.tipo),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {receitaSelecionada.tipo}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setReceitaSelecionada(null)}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: '#5A5A5A' }}>Data de Emissão:</span><br />
                    <strong>{new Date(receitaSelecionada.dataEmissao).toLocaleDateString('pt-BR')}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#5A5A5A' }}>Validade:</span><br />
                    <strong>{new Date(receitaSelecionada.dataValidade).toLocaleDateString('pt-BR')}</strong>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#5A5A5A' }}>Médico:</span><br />
                    <strong>{receitaSelecionada.medico.nome}</strong><br />
                    <span style={{ fontSize: '13px', color: '#5A5A5A' }}>{receitaSelecionada.medico.especialidade}</span><br />
                    <span style={{ fontSize: '13px', color: '#5A5A5A' }}>{receitaSelecionada.medico.crm}</span>
                  </div>
                  <div>
                    <span style={{ color: '#5A5A5A' }}>Unidade:</span><br />
                    <strong>{receitaSelecionada.unidade}</strong>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#006F6A', marginBottom: '12px' }}>
                  Diagnóstico
                </h3>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#E6F9FF', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#006F6A'
                }}>
                  {receitaSelecionada.diagnostico}
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#006F6A', marginBottom: '12px' }}>
                  Medicamentos Prescritos
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {receitaSelecionada.medicamentos.map((med, index) => (
                    <div 
                      key={index}
                      style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #E6F9FF'
                      }}
                    >
                      <div style={{ fontWeight: '600', color: '#006F6A', fontSize: '16px', marginBottom: '8px' }}>
                        {index + 1}. {med.nome}
                      </div>
                      <div style={{ display: 'grid', gap: '4px', fontSize: '14px', color: '#5A5A5A' }}>
                        <div><strong>Dosagem:</strong> {med.dosagem}</div>
                        <div><strong>Posologia:</strong> {med.posologia}</div>
                        <div><strong>Quantidade:</strong> {med.quantidade}</div>
                        <div><strong>Duração do tratamento:</strong> {med.duracao}</div>
                        {med.observacoes && (
                          <div style={{ 
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: '#fff3cd',
                            borderRadius: '6px',
                            fontSize: '13px'
                          }}>
                            <strong>⚠️ Observações:</strong> {med.observacoes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {receitaSelecionada.observacoesGerais && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#E6F9FF',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  <div style={{ color: '#006F6A', fontSize: '14px' }}>
                    <strong>📋 Observações Gerais:</strong><br />
                    {receitaSelecionada.observacoesGerais}
                  </div>
                </div>
              )}
              
              {receitaSelecionada.status === 'Cancelada' && receitaSelecionada.motivoCancelamento && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#ffe6e6',
                  borderRadius: '8px',
                  border: '1px solid #dc3545',
                  marginBottom: '24px'
                }}>
                  <div style={{ color: '#dc3545', fontSize: '14px' }}>
                    <strong>❌ Motivo do Cancelamento:</strong><br />
                    {receitaSelecionada.motivoCancelamento}
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={() => handleImprimir(receitaSelecionada)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#009688',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006F6A'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009688'}
                >
                  🖨️ Imprimir Receita
                </button>
                <button
                  onClick={() => setReceitaSelecionada(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#D9D9D9',
                    color: '#5A5A5A',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0c0c0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D9D9D9'}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
