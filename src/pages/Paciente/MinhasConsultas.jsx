import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { api } from '../../services/api';

export default function MinhasConsultas() {
  useAuth();
  const [consultas, setConsultas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await carregarConsultas();
    };
    init();
  }, []);

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pacientes/meu/consultas');
      const data = response.data;
      const consultasFormatadas = data.map(consulta => ({
        id: consulta.id,
        data: consulta.dataAtendimento,
        medico: {
          nome: consulta.medicoNome || 'Médico não informado',
          especialidade: 'Medicina',
          crm: consulta.medicoEspecialidade || 'CRM não informado'
        },
        unidade: consulta.unidadeNome || 'Unidade não informada',
        tipo: consulta.tipo === 'consulta' ? 'Consulta' : consulta.tipo === 'emergencia' ? 'Emergência' : 'Retorno',
        status: consulta.status === 'concluido' ? 'realizada' : consulta.status === 'agendado' ? 'agendada' : consulta.status === 'cancelado' ? 'cancelada' : consulta.status,
        motivo: consulta.queixaPrincipal || 'Não informado',
        diagnostico: consulta.hipoteseDiagnostica || '',
        conduta: consulta.conduta || '',
        observacoes: consulta.observacoes || '',
        motivoCancelamento: consulta.status === 'cancelado' ? (consulta.observacoes || 'Não informado') : ''
      }));
      
      setConsultas(consultasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const consultasFiltradas = consultas.filter(consulta => {
    const matchFiltro = 
      consulta.medico.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      consulta.motivo.toLowerCase().includes(filtro.toLowerCase()) ||
      consulta.unidade.toLowerCase().includes(filtro.toLowerCase());
    
    const matchStatus = filtroStatus === 'todas' || consulta.status === filtroStatus;
    
    return matchFiltro && matchStatus;
  });

  const getStatusInfo = (status) => {
    const statusMap = {
      agendada: { label: 'Agendada', color: '#17C4C1', icon: '📅' },
      realizada: { label: 'Realizada', color: '#006F6A', icon: '✅' },
      cancelada: { label: 'Cancelada', color: '#D9D9D9', icon: '❌' }
    };
    return statusMap[status] || statusMap.agendada;
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
            🩺 Minhas Consultas
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            Histórico e agendamentos de consultas médicas
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
              {consultas.length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Total de Consultas
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#17C4C1' }}>
              {consultas.filter(c => c.status === 'agendada').length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Agendadas
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
              {consultas.filter(c => c.status === 'realizada').length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Realizadas
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
              placeholder="Buscar por médico, motivo ou unidade..."
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
              <option value="todas">Todas as Consultas</option>
              <option value="agendada">Agendadas</option>
              <option value="realizada">Realizadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Lista de Consultas */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#5A5A5A' }}>
            Carregando consultas...
          </div>
        ) : consultasFiltradas.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
              Nenhuma consulta encontrada
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {consultasFiltradas.map((consulta) => {
              const statusInfo = getStatusInfo(consulta.status);
              const dataConsulta = new Date(consulta.data);
              const isFutura = dataConsulta > new Date();
              
              return (
                <div
                  key={consulta.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: isFutura ? '2px solid #17C4C1' : '2px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '32px' }}>
                          {statusInfo.icon}
                        </span>
                        <div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                            <h3 style={{ 
                              fontSize: '20px', 
                              fontWeight: '600', 
                              color: '#006F6A',
                              margin: 0
                            }}>
                              {consulta.tipo}
                            </h3>
                            <span style={{
                              backgroundColor: statusInfo.color,
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <div style={{ color: '#5A5A5A', fontSize: '14px' }}>
                            {dataConsulta.toLocaleDateString('pt-BR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid #E6F9FF'
                      }}>
                        <div>
                          <div style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '4px' }}>
                            👨‍⚕️ Médico
                          </div>
                          <div style={{ fontWeight: '500', color: '#006F6A' }}>
                            {consulta.medico.nome}
                          </div>
                          <div style={{ color: '#5A5A5A', fontSize: '12px' }}>
                            {consulta.medico.especialidade} | CRM: {consulta.medico.crm}
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '4px' }}>
                            🏥 Unidade
                          </div>
                          <div style={{ fontWeight: '500', color: '#006F6A' }}>
                            {consulta.unidade}
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '4px' }}>
                            📋 Motivo
                          </div>
                          <div style={{ fontWeight: '500', color: '#006F6A' }}>
                            {consulta.motivo}
                          </div>
                        </div>
                      </div>
                      
                      {consulta.status === 'realizada' && (
                        <div style={{
                          marginTop: '16px',
                          padding: '16px',
                          backgroundColor: '#E6F9FF',
                          borderRadius: '8px'
                        }}>
                          {consulta.diagnostico && (
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ color: '#006F6A', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                                Diagnóstico:
                              </div>
                              <div style={{ color: '#5A5A5A', fontSize: '14px' }}>
                                {consulta.diagnostico}
                              </div>
                            </div>
                          )}
                          
                          {consulta.conduta && (
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ color: '#006F6A', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                                Conduta:
                              </div>
                              <div style={{ color: '#5A5A5A', fontSize: '14px' }}>
                                {consulta.conduta}
                              </div>
                            </div>
                          )}
                          
                          {consulta.observacoes && (
                            <div>
                              <div style={{ color: '#006F6A', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                                Observações:
                              </div>
                              <div style={{ color: '#5A5A5A', fontSize: '14px' }}>
                                {consulta.observacoes}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {consulta.status === 'agendada' && consulta.observacoes && (
                        <div style={{
                          marginTop: '16px',
                          padding: '12px',
                          backgroundColor: '#fff3cd',
                          borderRadius: '8px',
                          border: '1px solid #ffc107'
                        }}>
                          <div style={{ color: '#856404', fontSize: '14px' }}>
                            ℹ️ <strong>Observação:</strong> {consulta.observacoes}
                          </div>
                        </div>
                      )}
                      
                      {consulta.status === 'cancelada' && consulta.motivoCancelamento && (
                        <div style={{
                          marginTop: '16px',
                          padding: '12px',
                          backgroundColor: '#f8d7da',
                          borderRadius: '8px'
                        }}>
                          <div style={{ color: '#721c24', fontSize: '14px' }}>
                            ❌ <strong>Motivo do cancelamento:</strong> {consulta.motivoCancelamento}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
