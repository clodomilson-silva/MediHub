import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function DetalhesExame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [exame, setExame] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarExame = React.useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API
      // const response = await fetch(`/api/exames/${id}`, {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      
      // Dados mock
      const mockData = {
        id: parseInt(id),
        paciente_id: 1,
        paciente_nome: 'Maria Silva',
        paciente_cpf: '123.456.789-00',
        paciente_data_nascimento: '1985-03-15',
        tipo: 'Hemograma Completo',
        data_solicitacao: '2025-12-08T10:30:00',
        data_coleta: '2025-12-09T08:00:00',
        data_resultado: '2025-12-10T14:20:00',
        medico_solicitante: 'Dr. João Santos',
        medico_crm: 'CRM/SP 123456',
        laboratorio: 'Laboratório Central de Análises',
        unidade: 'Unidade Central',
        status: 'Concluído',
        resultado_texto: 'Hemograma dentro dos parâmetros normais',
        resultado_detalhado: {
          'Hemácias': { valor: '4.8', unidade: 'milhões/mm³', referencia: '4.5 - 5.9' },
          'Hemoglobina': { valor: '14.2', unidade: 'g/dL', referencia: '13.5 - 17.5' },
          'Hematócrito': { valor: '42', unidade: '%', referencia: '40 - 50' },
          'VCM': { valor: '88', unidade: 'fL', referencia: '80 - 100' },
          'HCM': { valor: '29.6', unidade: 'pg', referencia: '27 - 32' },
          'CHCM': { valor: '33.8', unidade: 'g/dL', referencia: '32 - 36' },
          'Leucócitos': { valor: '7500', unidade: '/mm³', referencia: '4000 - 11000' },
          'Neutrófilos': { valor: '60', unidade: '%', referencia: '40 - 70' },
          'Linfócitos': { valor: '30', unidade: '%', referencia: '20 - 40' },
          'Monócitos': { valor: '6', unidade: '%', referencia: '2 - 10' },
          'Eosinófilos': { valor: '3', unidade: '%', referencia: '1 - 5' },
          'Basófilos': { valor: '1', unidade: '%', referencia: '0 - 2' },
          'Plaquetas': { valor: '250000', unidade: '/mm³', referencia: '150000 - 400000' }
        },
        interpretacao: 'Todos os parâmetros hematológicos encontram-se dentro dos valores de referência. Hemograma normal.',
        observacoes: 'Paciente em jejum adequado. Coleta sem intercorrências.',
        arquivo_url: '/exames/hemograma_001.pdf',
        arquivo_nome: 'hemograma_maria_silva_2025-12-10.pdf',
        created_at: '2025-12-08T10:30:00',
        updated_at: '2025-12-10T14:20:00'
      };
      
      setExame(mockData);
    } catch (error) {
      console.error('Erro ao carregar exame:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarExame();
  }, [carregarExame]);

  const handleExcluir = async () => {
    if (!confirm('Tem certeza que deseja excluir este exame?')) {
      return;
    }

    try {
      // TODO: Integrar com API
      // await fetch(`/api/exames/${id}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      
      alert('Exame excluído com sucesso!');
      navigate('/exames');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir exame');
    }
  };

  const handleDownload = () => {
    // TODO: Implementar download do arquivo
    alert('Download do arquivo em desenvolvimento');
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center', color: '#5A5A5A' }}>
          Carregando exame...
        </div>
      </DashboardLayout>
    );
  }

  if (!exame) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#5A5A5A', marginBottom: '16px' }}>
            Exame não encontrado
          </p>
          <Link
            to="/exames"
            style={{
              color: '#009688',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ← Voltar para lista
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            to="/exames"
            style={{
              color: '#009688',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}
          >
            ← Voltar para Exames
          </Link>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: '#006F6A',
                marginBottom: '8px'
              }}>
                {exame.tipo}
              </h1>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{
                  backgroundColor: getStatusColor(exame.status),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {getStatusIcon(exame.status)} {exame.status}
                </span>
                {exame.arquivo_url && (
                  <span style={{
                    backgroundColor: '#E6F9FF',
                    color: '#006F6A',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    📎 Arquivo disponível
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {exame.arquivo_url && (
                <button
                  onClick={handleDownload}
                  style={{
                    backgroundColor: '#17C4C1',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📥 Baixar PDF
                </button>
              )}
              
              {hasPermission('exames', 'edit') && (
                <Link
                  to={`/exames/editar/${id}`}
                  style={{
                    backgroundColor: '#00A8A1',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Editar
                </Link>
              )}
              
              {hasPermission('exames', 'delete') && (
                <button
                  onClick={handleExcluir}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Informações do Paciente */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#006F6A',
              marginBottom: '16px',
              borderBottom: '2px solid #E6F9FF',
              paddingBottom: '8px'
            }}>
              👤 Informações do Paciente
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  Nome Completo
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  <Link 
                    to={`/paciente/${exame.paciente_id}`}
                    style={{ color: '#009688', textDecoration: 'none', fontWeight: '500' }}
                  >
                    {exame.paciente_nome}
                  </Link>
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  CPF
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {exame.paciente_cpf}
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  Data de Nascimento
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {new Date(exame.paciente_data_nascimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          {/* Dados da Solicitação */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#006F6A',
              marginBottom: '16px',
              borderBottom: '2px solid #E6F9FF',
              paddingBottom: '8px'
            }}>
              📋 Dados da Solicitação
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  Data de Solicitação
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {new Date(exame.data_solicitacao).toLocaleString('pt-BR')}
                </p>
              </div>
              
              {exame.data_coleta && (
                <div>
                  <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                    Data de Coleta
                  </label>
                  <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                    {new Date(exame.data_coleta).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
              
              {exame.data_resultado && (
                <div>
                  <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                    Data do Resultado
                  </label>
                  <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                    {new Date(exame.data_resultado).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  Médico Solicitante
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {exame.medico_solicitante}
                </p>
                <p style={{ fontSize: '14px', color: '#5A5A5A', marginTop: '2px' }}>
                  {exame.medico_crm}
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  Laboratório
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {exame.laboratorio}
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  Unidade
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {exame.unidade}
                </p>
              </div>
            </div>
          </div>

          {/* Resultados Detalhados */}
          {exame.resultado_detalhado && (
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#006F6A',
                marginBottom: '16px',
                borderBottom: '2px solid #E6F9FF',
                paddingBottom: '8px'
              }}>
                🔬 Resultados Detalhados
              </h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#E6F9FF' }}>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        color: '#006F6A',
                        borderBottom: '2px solid #009688'
                      }}>
                        Parâmetro
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#006F6A',
                        borderBottom: '2px solid #009688'
                      }}>
                        Resultado
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#006F6A',
                        borderBottom: '2px solid #009688'
                      }}>
                        Unidade
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#006F6A',
                        borderBottom: '2px solid #009688'
                      }}>
                        Referência
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(exame.resultado_detalhado).map(([parametro, dados], index) => (
                      <tr 
                        key={parametro}
                        style={{ 
                          backgroundColor: index % 2 === 0 ? 'white' : '#F5F6F7',
                          borderBottom: '1px solid #E6F9FF'
                        }}
                      >
                        <td style={{ padding: '12px', fontWeight: '500', color: '#006F6A' }}>
                          {parametro}
                        </td>
                        <td style={{ 
                          padding: '12px', 
                          textAlign: 'center',
                          fontWeight: '600',
                          color: '#006F6A'
                        }}>
                          {dados.valor}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#5A5A5A' }}>
                          {dados.unidade}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#5A5A5A' }}>
                          {dados.referencia}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Interpretação e Observações */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#006F6A',
              marginBottom: '16px',
              borderBottom: '2px solid #E6F9FF',
              paddingBottom: '8px'
            }}>
              📊 Interpretação e Observações
            </h2>
            
            {exame.resultado_texto && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Resultado Geral
                </label>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#009688', 
                  lineHeight: '1.6',
                  fontWeight: '600',
                  backgroundColor: '#E6F9FF',
                  padding: '12px',
                  borderRadius: '8px'
                }}>
                  {exame.resultado_texto}
                </p>
              </div>
            )}
            
            {exame.interpretacao && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Interpretação Médica
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', lineHeight: '1.6' }}>
                  {exame.interpretacao}
                </p>
              </div>
            )}
            
            {exame.observacoes && (
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Observações
                </label>
                <p style={{ fontSize: '16px', color: '#5A5A5A', lineHeight: '1.6' }}>
                  {exame.observacoes}
                </p>
              </div>
            )}
          </div>

          {/* Arquivo Anexado */}
          {exame.arquivo_url && (
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#006F6A',
                marginBottom: '16px',
                borderBottom: '2px solid #E6F9FF',
                paddingBottom: '8px'
              }}>
                📎 Arquivo Anexado
              </h2>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#F5F6F7',
                borderRadius: '8px',
                border: '1px dashed #D9D9D9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    fontSize: '32px',
                    backgroundColor: '#E6F9FF',
                    padding: '12px',
                    borderRadius: '8px'
                  }}>
                    📄
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', color: '#006F6A', marginBottom: '4px' }}>
                      {exame.arquivo_nome}
                    </p>
                    <p style={{ fontSize: '14px', color: '#5A5A5A' }}>
                      PDF • Resultado do exame
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleDownload}
                  style={{
                    backgroundColor: '#009688',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📥 Baixar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
