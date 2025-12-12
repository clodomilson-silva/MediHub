import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function DetalhesReceita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [receita, setReceita] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarReceita = React.useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API
      // const response = await fetch(`/api/receitas/${id}`, {
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
        atendimento_id: 1,
        atendimento_tipo: 'Consulta',
        atendimento_data: '2025-12-10',
        medico_nome: 'Dr. João Santos',
        medico_crm: 'CRM/SP 123456',
        unidade: 'Unidade Central',
        data_emissao: '2025-12-10T15:30:00',
        data_validade: '2026-01-10',
        medicamentos: [
          {
            id: 1,
            nome: 'Paracetamol 750mg',
            dosagem: '1 comprimido',
            via: 'Oral',
            frequencia: '8/8 horas',
            duracao: '5 dias',
            quantidade: '15 comprimidos',
            observacoes: 'Tomar após as refeições'
          },
          {
            id: 2,
            nome: 'Dipirona 500mg',
            dosagem: '1 comprimido',
            via: 'Oral',
            frequencia: 'Se necessário (dor)',
            duracao: '5 dias',
            quantidade: '10 comprimidos',
            observacoes: 'Máximo 4 comprimidos por dia'
          }
        ],
        observacoes_gerais: 'Manter hidratação adequada. Retornar se os sintomas persistirem após 3 dias.',
        status: 'Válida',
        created_at: '2025-12-10T15:30:00'
      };
      
      setReceita(mockData);
    } catch (error) {
      console.error('Erro ao carregar receita:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarReceita();
  }, [carregarReceita]);

  const handleExcluir = async () => {
    if (!confirm('Tem certeza que deseja excluir esta receita?')) {
      return;
    }

    try {
      // TODO: Integrar com API
      // await fetch(`/api/receitas/${id}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      
      alert('Receita excluída com sucesso!');
      navigate('/receitas');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir receita');
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Válida': return '#006F6A';
      case 'Vencida': return '#dc3545';
      case 'Cancelada': return '#D9D9D9';
      default: return '#5A5A5A';
    }
  };

  const isReceitaVencida = () => {
    if (!receita?.data_validade) return false;
    return new Date(receita.data_validade) < new Date();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center', color: '#5A5A5A' }}>
          Carregando receita...
        </div>
      </DashboardLayout>
    );
  }

  if (!receita) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#5A5A5A', marginBottom: '16px' }}>
            Receita não encontrada
          </p>
          <Link
            to="/receitas"
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

  const statusAtual = isReceitaVencida() ? 'Vencida' : receita.status;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: '32px' }} className="no-print">
          <Link
            to="/receitas"
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
            ← Voltar para Receitas
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
                Receita Médica #{receita.id}
              </h1>
              <span style={{
                backgroundColor: getStatusColor(statusAtual),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {statusAtual}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleImprimir}
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
                🖨️ Imprimir
              </button>
              
              {hasPermission('receitas', 'edit') && (
                <Link
                  to={`/receitas/editar/${id}`}
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
              
              {hasPermission('receitas', 'delete') && (
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

        {/* Conteúdo da Receita - Imprimível */}
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Cabeçalho da Receita */}
          <div style={{ 
            borderBottom: '3px solid #009688',
            paddingBottom: '24px',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#006F6A',
              marginBottom: '8px'
            }}>
              RECEITA MÉDICA
            </h2>
            <p style={{ color: '#5A5A5A', fontSize: '14px' }}>
              {receita.unidade}
            </p>
          </div>

          {/* Informações do Médico */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#006F6A',
              marginBottom: '12px'
            }}>
              Médico Prescritor
            </h3>
            <p style={{ fontSize: '16px', color: '#5A5A5A', marginBottom: '4px' }}>
              <strong>Nome:</strong> {receita.medico_nome}
            </p>
            <p style={{ fontSize: '16px', color: '#5A5A5A' }}>
              <strong>CRM:</strong> {receita.medico_crm}
            </p>
          </div>

          {/* Informações do Paciente */}
          <div style={{ 
            backgroundColor: '#E6F9FF',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '32px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#006F6A',
              marginBottom: '12px'
            }}>
              Dados do Paciente
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              <p style={{ fontSize: '16px', color: '#5A5A5A' }}>
                <strong>Nome:</strong> {receita.paciente_nome}
              </p>
              <p style={{ fontSize: '16px', color: '#5A5A5A' }}>
                <strong>CPF:</strong> {receita.paciente_cpf}
              </p>
              <p style={{ fontSize: '16px', color: '#5A5A5A' }}>
                <strong>Data de Nascimento:</strong> {new Date(receita.paciente_data_nascimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Prescrição */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#006F6A',
              marginBottom: '20px',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              ℞ Prescrição
            </h3>
            
            {receita.medicamentos.map((medicamento, index) => (
              <div 
                key={medicamento.id}
                style={{
                  border: '2px solid #E6F9FF',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '16px',
                  backgroundColor: index % 2 === 0 ? 'white' : '#F5F6F7'
                }}
              >
                <h4 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#009688',
                  marginBottom: '12px'
                }}>
                  {index + 1}. {medicamento.nome}
                </h4>
                
                <div style={{ 
                  display: 'grid',
                  gap: '8px',
                  fontSize: '15px',
                  color: '#5A5A5A'
                }}>
                  <p>
                    <strong>Dosagem:</strong> {medicamento.dosagem}
                  </p>
                  <p>
                    <strong>Via:</strong> {medicamento.via}
                  </p>
                  <p>
                    <strong>Frequência:</strong> {medicamento.frequencia}
                  </p>
                  <p>
                    <strong>Duração:</strong> {medicamento.duracao}
                  </p>
                  <p>
                    <strong>Quantidade:</strong> {medicamento.quantidade}
                  </p>
                  
                  {medicamento.observacoes && (
                    <div style={{
                      marginTop: '8px',
                      padding: '12px',
                      backgroundColor: '#FFF9E6',
                      borderLeft: '4px solid #FFC107',
                      borderRadius: '4px'
                    }}>
                      <strong style={{ color: '#856404' }}>Observações:</strong>
                      <p style={{ color: '#856404', marginTop: '4px' }}>
                        {medicamento.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Observações Gerais */}
          {receita.observacoes_gerais && (
            <div style={{
              backgroundColor: '#FFF9E6',
              border: '2px solid #FFC107',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '32px'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#856404',
                marginBottom: '8px'
              }}>
                ⚠️ Observações Gerais
              </h3>
              <p style={{ fontSize: '15px', color: '#856404', lineHeight: '1.6' }}>
                {receita.observacoes_gerais}
              </p>
            </div>
          )}

          {/* Rodapé da Receita */}
          <div style={{ 
            borderTop: '2px solid #E6F9FF',
            paddingTop: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            fontSize: '14px',
            color: '#5A5A5A'
          }}>
            <div>
              <p><strong>Data de Emissão:</strong></p>
              <p>{new Date(receita.data_emissao).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p><strong>Válida até:</strong></p>
              <p style={{ 
                color: isReceitaVencida() ? '#dc3545' : '#006F6A',
                fontWeight: '600'
              }}>
                {new Date(receita.data_validade).toLocaleDateString('pt-BR')}
                {isReceitaVencida() && ' (VENCIDA)'}
              </p>
            </div>
          </div>

          {/* Assinatura */}
          <div style={{ 
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid #D9D9D9',
            textAlign: 'center'
          }}>
            <div style={{
              borderTop: '2px solid #5A5A5A',
              width: '300px',
              margin: '0 auto 8px',
              paddingTop: '8px'
            }}>
              <p style={{ fontWeight: '600', color: '#006F6A' }}>
                {receita.medico_nome}
              </p>
              <p style={{ fontSize: '14px', color: '#5A5A5A' }}>
                {receita.medico_crm}
              </p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais (não imprimíveis) */}
        <div className="no-print" style={{ 
          marginTop: '32px',
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '32px auto 0'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#006F6A',
            marginBottom: '16px'
          }}>
            ℹ️ Informações Adicionais
          </h3>
          
          <div style={{ display: 'grid', gap: '12px', fontSize: '14px', color: '#5A5A5A' }}>
            <p>
              <strong>Atendimento:</strong>{' '}
              <Link 
                to={`/atendimento/${receita.atendimento_id}`}
                style={{ color: '#009688', textDecoration: 'none', fontWeight: '500' }}
              >
                {receita.atendimento_tipo} - {new Date(receita.atendimento_data).toLocaleDateString('pt-BR')}
              </Link>
            </p>
            <p>
              <strong>Paciente:</strong>{' '}
              <Link 
                to={`/paciente/${receita.paciente_id}`}
                style={{ color: '#009688', textDecoration: 'none', fontWeight: '500' }}
              >
                Ver prontuário completo
              </Link>
            </p>
            <p>
              <strong>Criada em:</strong> {new Date(receita.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Estilos de Impressão */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 20px;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
