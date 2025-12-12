import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function DetalhesAtendimento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [atendimento, setAtendimento] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarAtendimento = React.useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API
      // const response = await fetch(`/api/atendimentos/${id}`, {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      
      // Dados mock
      const mockData = {
        id: parseInt(id),
        paciente_id: 1,
        paciente_nome: 'Maria Silva',
        paciente_cpf: '123.456.789-00',
        data_atendimento: '2025-12-10T14:30:00',
        tipo: 'Consulta',
        medico_nome: 'Dr. João Santos',
        medico_crm: 'CRM/SP 123456',
        unidade: 'Unidade Central',
        status: 'Finalizado',
        motivo: 'Dor de cabeça persistente há 3 dias, sensibilidade à luz',
        sintomas: 'Cefaleia intensa, fotofobia, náuseas ocasionais',
        historico_doenca_atual: 'Paciente relata episódios recorrentes de dor de cabeça nos últimos 6 meses, com piora progressiva',
        exame_fisico: 'PA: 120/80 mmHg, FC: 72 bpm, Tax: 36.5°C. Paciente lúcida, orientada. Exame neurológico sem alterações.',
        diagnostico: 'Enxaqueca crônica (CID G43.3)',
        conduta: 'Prescrito analgésico e orientações sobre gatilhos. Solicitado retorno em 30 dias.',
        observacoes: 'Orientada sobre uso de diário da dor e identificação de fatores desencadeantes.',
        created_at: '2025-12-10T14:30:00',
        updated_at: '2025-12-10T15:45:00'
      };
      
      setAtendimento(mockData);
    } catch (error) {
      console.error('Erro ao carregar atendimento:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarAtendimento();
  }, [carregarAtendimento]);

  const handleExcluir = async () => {
    if (!confirm('Tem certeza que deseja excluir este atendimento?')) {
      return;
    }

    try {
      // TODO: Integrar com API
      // await fetch(`/api/atendimentos/${id}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      
      alert('Atendimento excluído com sucesso!');
      navigate('/atendimentos');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir atendimento');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center', color: '#5A5A5A' }}>
          Carregando atendimento...
        </div>
      </DashboardLayout>
    );
  }

  if (!atendimento) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#5A5A5A', marginBottom: '16px' }}>
            Atendimento não encontrado
          </p>
          <Link
            to="/atendimentos"
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Agendado': return '#00A8A1';
      case 'Finalizado': return '#006F6A';
      case 'Cancelado': return '#D9D9D9';
      default: return '#5A5A5A';
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            to="/atendimentos"
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
            ← Voltar para Atendimentos
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
                Atendimento #{atendimento.id}
              </h1>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{
                  backgroundColor: getStatusColor(atendimento.status),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {atendimento.status}
                </span>
                <span style={{
                  backgroundColor: '#E6F9FF',
                  color: '#006F6A',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {atendimento.tipo}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {hasPermission('atendimentos', 'edit') && (
                <Link
                  to={`/atendimentos/editar/${id}`}
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
              
              {hasPermission('atendimentos', 'delete') && (
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
                    to={`/paciente/${atendimento.paciente_id}`}
                    style={{ color: '#009688', textDecoration: 'none', fontWeight: '500' }}
                  >
                    {atendimento.paciente_nome}
                  </Link>
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  CPF
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {atendimento.paciente_cpf}
                </p>
              </div>
            </div>
          </div>

          {/* Dados do Atendimento */}
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
              📋 Dados do Atendimento
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  Data e Hora
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {new Date(atendimento.data_atendimento).toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  Médico Responsável
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {atendimento.medico_nome}
                </p>
                <p style={{ fontSize: '14px', color: '#5A5A5A', marginTop: '2px' }}>
                  {atendimento.medico_crm}
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500' }}>
                  Unidade de Saúde
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', marginTop: '4px' }}>
                  {atendimento.unidade}
                </p>
              </div>
            </div>
          </div>

          {/* Motivo da Consulta */}
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
              💬 Motivo da Consulta
            </h2>
            <p style={{ fontSize: '16px', color: '#5A5A5A', lineHeight: '1.6' }}>
              {atendimento.motivo}
            </p>
          </div>

          {/* Anamnese */}
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
              📝 Anamnese
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Sintomas
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', lineHeight: '1.6' }}>
                  {atendimento.sintomas}
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  História da Doença Atual
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', lineHeight: '1.6' }}>
                  {atendimento.historico_doenca_atual}
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Exame Físico
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', lineHeight: '1.6' }}>
                  {atendimento.exame_fisico}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnóstico e Conduta */}
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
              🏥 Diagnóstico e Conduta
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Diagnóstico
                </label>
                <p style={{ 
                  fontSize: '18px', 
                  color: '#009688', 
                  lineHeight: '1.6',
                  fontWeight: '600',
                  backgroundColor: '#E6F9FF',
                  padding: '12px',
                  borderRadius: '8px'
                }}>
                  {atendimento.diagnostico}
                </p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  Conduta Médica
                </label>
                <p style={{ fontSize: '16px', color: '#006F6A', lineHeight: '1.6' }}>
                  {atendimento.conduta}
                </p>
              </div>
              
              {atendimento.observacoes && (
                <div>
                  <label style={{ fontSize: '14px', color: '#5A5A5A', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                    Observações
                  </label>
                  <p style={{ fontSize: '16px', color: '#006F6A', lineHeight: '1.6' }}>
                    {atendimento.observacoes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
