import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      if (user?.tipo === 'paciente') {
        // Para pacientes, buscar dados do prontuário
        const prontuarioRes = await api.get('/pacientes/meu/prontuario');
        const consultasRes = await api.get('/pacientes/meu/consultas');
        
        setStats({
          totalConsultas: prontuarioRes.data.estatisticas?.totalConsultas || 0,
          totalExames: prontuarioRes.data.estatisticas?.totalExames || 0,
          totalReceitas: prontuarioRes.data.estatisticas?.totalReceitas || 0,
          proximaConsulta: prontuarioRes.data.proximaConsulta ? 1 : 0
        });
        
        // Pegar últimos 5 atendimentos
        setAtendimentos(consultasRes.data.slice(0, 5));
      } else {
        // Para admin/médico, buscar dados gerais reais
        const estatisticasRes = await api.get('/pacientes/dashboard/estatisticas');
        const atendimentosRes = await api.get('/pacientes/dashboard/atendimentos-recentes?limite=5');
        
        setStats({
          totalPacientes: estatisticasRes.data.totalPacientes,
          consultasHoje: estatisticasRes.data.consultasHoje,
          examesPendentes: estatisticasRes.data.examesPendentes,
          procedimentos: estatisticasRes.data.procedimentos
        });
        
        setAtendimentos(atendimentosRes.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCards = () => {
    if (user?.tipo === 'paciente') {
      return [
        { titulo: 'Minhas Consultas', valor: stats?.totalConsultas || 0, cor: '#009688' },
        { titulo: 'Meus Exames', valor: stats?.totalExames || 0, cor: '#00A8A1' },
        { titulo: 'Minhas Receitas', valor: stats?.totalReceitas || 0, cor: '#17C4C1' },
        { titulo: 'Próxima Consulta', valor: stats?.proximaConsulta ? 'Agendada' : 'Nenhuma', cor: '#006F6A' }
      ];
    }
    
    return [
      { titulo: 'Total de Pacientes', valor: stats?.totalPacientes || 0, cor: '#009688' },
      { titulo: 'Consultas Hoje', valor: stats?.consultasHoje || 0, cor: '#00A8A1' },
      { titulo: 'Exames Pendentes', valor: stats?.examesPendentes || 0, cor: '#17C4C1' },
      { titulo: 'Procedimentos', valor: stats?.procedimentos || 0, cor: '#006F6A' }
    ];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          Carregando...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        {/* Cards de Estatísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {getCards().map((card, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${card.cor}`
              }}
            >
              <h3 style={{
                fontSize: '14px',
                color: '#5A5A5A',
                marginBottom: '8px'
              }}>
                {card.titulo}
              </h3>
              <p style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: card.cor
              }}>
                {card.valor}
              </p>
            </div>
          ))}
        </div>

        {/* Seção Principal */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#006F6A',
            marginBottom: '24px'
          }}>
            Bem-vindo ao MediHub{user?.nome ? `, ${user.nome}` : ''}
          </h2>
          <p style={{ color: '#5A5A5A', lineHeight: '1.6', marginBottom: '24px' }}>
            {user?.tipo === 'paciente' 
              ? 'Acompanhe suas consultas, exames e receitas médicas.'
              : 'Gerencie pacientes, consultas, exames e procedimentos de forma integrada.'}
          </p>

          {user?.tipo !== 'paciente' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <button style={{
                backgroundColor: '#009688',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                Novo Paciente
              </button>
              <button style={{
                backgroundColor: '#00A8A1',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                Nova Consulta
              </button>
              <button style={{
                backgroundColor: '#17C4C1',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                Novo Exame
              </button>
            </div>
          )}
        </div>

        {/* Atendimentos Recentes */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '24px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#006F6A',
            marginBottom: '16px'
          }}>
            {user?.tipo === 'paciente' ? 'Minhas Últimas Consultas' : 'Atendimentos Recentes'}
          </h3>
          {atendimentos.length === 0 ? (
            <p style={{ color: '#5A5A5A', textAlign: 'center', padding: '24px' }}>
              Nenhum atendimento registrado
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F5F6F7' }}>
                    {user?.tipo !== 'paciente' && (
                      <th style={{ padding: '12px', textAlign: 'left', color: '#5A5A5A' }}>Paciente</th>
                    )}
                    <th style={{ padding: '12px', textAlign: 'left', color: '#5A5A5A' }}>
                      {user?.tipo === 'paciente' ? 'Médico' : 'Tipo'}
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#5A5A5A' }}>Data</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#5A5A5A' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {atendimentos.map((item, idx) => {
                    const dataAtendimento = item.data || item.dataAtendimento;
                    const dataFormatada = dataAtendimento 
                      ? new Date(dataAtendimento).toLocaleDateString('pt-BR')
                      : 'Data não informada';
                    
                    const statusMap = {
                      'agendada': 'Agendada',
                      'agendado': 'Agendado',
                      'realizada': 'Realizada',
                      'concluido': 'Concluído',
                      'cancelada': 'Cancelada',
                      'Concluído': 'Concluído',
                      'Pendente': 'Pendente'
                    };
                    
                    const tipoMap = {
                      'consulta': 'Consulta',
                      'emergencia': 'Emergência',
                      'retorno': 'Retorno'
                    };
                    
                    const status = statusMap[item.status] || item.status || 'Pendente';
                    
                    return (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid #F5F6F7' }}>
                        {user?.tipo !== 'paciente' && (
                          <td style={{ padding: '12px', color: '#5A5A5A' }}>
                            {item.pacienteNome || item.paciente || 'N/A'}
                          </td>
                        )}
                        <td style={{ padding: '12px', color: '#5A5A5A' }}>
                          {user?.tipo === 'paciente' 
                            ? (item.medico?.nome || item.medicoNome || 'Médico não informado')
                            : (tipoMap[item.tipo] || item.tipo || 'Consulta')}
                        </td>
                        <td style={{ padding: '12px', color: '#5A5A5A' }}>{dataFormatada}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            backgroundColor: (status === 'Concluído' || status === 'Realizada') ? '#009688' : '#00A8A1',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
