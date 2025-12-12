import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function ListaExames() {
  const [exames, setExames] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarExames();
  }, []);

  const carregarExames = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API
      // const response = await fetch('/api/exames', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      
      // Dados mock
      const mockData = [
        {
          id: 1,
          paciente_nome: 'Maria Silva',
          paciente_cpf: '123.456.789-00',
          tipo: 'Hemograma Completo',
          data_solicitacao: '2025-12-08',
          data_resultado: '2025-12-10',
          medico_solicitante: 'Dr. João Santos',
          status: 'Concluído',
          resultado: 'Normal',
          observacoes: 'Todos os parâmetros dentro da normalidade',
          arquivo_url: '/exames/hemograma_001.pdf'
        },
        {
          id: 2,
          paciente_nome: 'João Oliveira',
          paciente_cpf: '987.654.321-00',
          tipo: 'Glicemia de Jejum',
          data_solicitacao: '2025-12-09',
          data_resultado: '2025-12-11',
          medico_solicitante: 'Dra. Ana Costa',
          status: 'Concluído',
          resultado: '95 mg/dL',
          observacoes: 'Glicemia dentro do esperado',
          arquivo_url: '/exames/glicemia_002.pdf'
        },
        {
          id: 3,
          paciente_nome: 'Maria Silva',
          paciente_cpf: '123.456.789-00',
          tipo: 'Radiografia de Tórax',
          data_solicitacao: '2025-12-10',
          data_resultado: null,
          medico_solicitante: 'Dr. Carlos Lima',
          status: 'Aguardando',
          resultado: null,
          observacoes: 'Solicitado para investigação de tosse persistente',
          arquivo_url: null
        },
        {
          id: 4,
          paciente_nome: 'Ana Santos',
          paciente_cpf: '456.789.123-00',
          tipo: 'Ultrassom Abdominal',
          data_solicitacao: '2025-12-05',
          data_resultado: '2025-12-07',
          medico_solicitante: 'Dr. João Santos',
          status: 'Concluído',
          resultado: 'Esteatose hepática grau I',
          observacoes: 'Presença de gordura no fígado. Recomenda-se acompanhamento nutricional.',
          arquivo_url: '/exames/us_003.pdf'
        }
      ];
      
      setExames(mockData);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  const examesFiltrados = exames.filter(exame => {
    const matchFiltro = 
      exame.paciente_nome.toLowerCase().includes(filtro.toLowerCase()) ||
      exame.paciente_cpf.includes(filtro) ||
      exame.tipo.toLowerCase().includes(filtro.toLowerCase());
    
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#006F6A',
              marginBottom: '8px'
            }}>
              Exames Laboratoriais
            </h1>
            <p style={{ color: '#5A5A5A' }}>
              Gerenciamento de exames e resultados
            </p>
          </div>
          
          <Link
            to="/exames/novo"
            style={{
              backgroundColor: '#009688',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span>
            Solicitar Exame
          </Link>
        </div>

        {/* Filtros */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Buscar por paciente, CPF ou tipo de exame..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                flex: 1,
                minWidth: '250px',
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
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {examesFiltrados.map((exame) => (
              <Link
                key={exame.id}
                to={`/exame/${exame.id}`}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  border: '2px solid transparent'
                }}
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
                      <span style={{
                        backgroundColor: getStatusColor(exame.status),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
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
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          📎 Arquivo anexado
                        </span>
                      )}
                    </div>
                    
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      color: '#006F6A',
                      marginBottom: '8px'
                    }}>
                      {exame.tipo}
                    </h3>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      color: '#5A5A5A',
                      fontSize: '14px',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <strong>Paciente:</strong> {exame.paciente_nome}
                      </div>
                      <div>
                        <strong>CPF:</strong> {exame.paciente_cpf}
                      </div>
                      <div>
                        <strong>Solicitado em:</strong> {new Date(exame.data_solicitacao).toLocaleDateString('pt-BR')}
                      </div>
                      {exame.data_resultado && (
                        <div>
                          <strong>Resultado em:</strong> {new Date(exame.data_resultado).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Médico:</strong> {exame.medico_solicitante}
                    </div>
                    
                    {exame.resultado && (
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '12px',
                        backgroundColor: '#E6F9FF',
                        borderRadius: '8px',
                        borderLeft: '4px solid #009688'
                      }}>
                        <strong style={{ color: '#006F6A', display: 'block', marginBottom: '4px' }}>
                          Resultado:
                        </strong>
                        <span style={{ color: '#5A5A5A', fontSize: '14px' }}>
                          {exame.resultado}
                        </span>
                      </div>
                    )}
                    
                    {exame.observacoes && (
                      <div style={{ marginTop: '8px', color: '#5A5A5A', fontSize: '14px' }}>
                        <strong>Observações:</strong> {exame.observacoes}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ 
                    fontSize: '24px',
                    color: '#009688'
                  }}>
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        <div style={{ 
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#009688' }}>
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
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00A8A1' }}>
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
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#006F6A' }}>
              {exames.filter(e => e.status === 'Concluído').length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Concluídos
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17C4C1' }}>
              {exames.filter(e => e.arquivo_url).length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Com Arquivo
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
