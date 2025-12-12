import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function ListaUnidades() {
  const [unidades, setUnidades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const carregarUnidades = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API
      // const response = await fetch('/api/unidades', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      
      // Dados mock
      const mockData = [
        {
          id: 1,
          nome: 'Unidade Central de Saúde',
          endereco: 'Rua das Flores, 100',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
          telefone: '(11) 3456-7890',
          email: 'central@medihub.com.br',
          horarioFuncionamento: 'Segunda a Sexta: 7h às 19h',
          ativo: true,
          totalPacientes: 1250,
          totalMedicos: 15
        },
        {
          id: 2,
          nome: 'Unidade Norte',
          endereco: 'Av. Principal, 500',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '02345-678',
          telefone: '(11) 3456-7891',
          email: 'norte@medihub.com.br',
          horarioFuncionamento: 'Segunda a Sexta: 8h às 18h',
          ativo: true,
          totalPacientes: 850,
          totalMedicos: 10
        },
        {
          id: 3,
          nome: 'Unidade Sul',
          endereco: 'Rua do Comércio, 250',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '04567-890',
          telefone: '(11) 3456-7892',
          email: 'sul@medihub.com.br',
          horarioFuncionamento: 'Segunda a Sábado: 7h às 17h',
          ativo: false,
          totalPacientes: 620,
          totalMedicos: 8
        }
      ];
      
      setUnidades(mockData);
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await carregarUnidades();
    };
    init();
  }, []);

  const unidadesFiltradas = unidades.filter(unidade => 
    unidade.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    unidade.cidade.toLowerCase().includes(filtro.toLowerCase()) ||
    unidade.endereco.toLowerCase().includes(filtro.toLowerCase())
  );

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
              Unidades de Saúde
            </h1>
            <p style={{ color: '#5A5A5A' }}>
              Gerenciamento de unidades e suas informações
            </p>
          </div>
          
          <Link
            to="/unidades/nova"
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
            Nova Unidade
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
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou endereço..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #D9D9D9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Lista de Unidades */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#5A5A5A' }}>
            Carregando unidades...
          </div>
        ) : unidadesFiltradas.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
              Nenhuma unidade encontrada
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {unidadesFiltradas.map((unidade) => (
              <Link
                key={unidade.id}
                to={`/unidade/${unidade.id}`}
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
                        fontSize: '32px'
                      }}>
                        🏥
                      </span>
                      <div>
                        <h3 style={{ 
                          fontSize: '20px', 
                          fontWeight: '600', 
                          color: '#006F6A',
                          marginBottom: '4px'
                        }}>
                          {unidade.nome}
                        </h3>
                        <span style={{
                          backgroundColor: unidade.ativo ? '#006F6A' : '#D9D9D9',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {unidade.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '12px',
                      color: '#5A5A5A',
                      fontSize: '14px',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <strong>📍 Endereço:</strong><br />
                        {unidade.endereco}<br />
                        {unidade.cidade} - {unidade.estado} | CEP: {unidade.cep}
                      </div>
                      <div>
                        <strong>📞 Contato:</strong><br />
                        {unidade.telefone}<br />
                        {unidade.email}
                      </div>
                      <div>
                        <strong>🕐 Horário:</strong><br />
                        {unidade.horarioFuncionamento}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '24px',
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #E6F9FF'
                    }}>
                      <div style={{
                        backgroundColor: '#E6F9FF',
                        padding: '8px 16px',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#009688' }}>
                          {unidade.totalPacientes}
                        </span>
                        <span style={{ fontSize: '12px', color: '#5A5A5A', marginLeft: '8px' }}>
                          Pacientes
                        </span>
                      </div>
                      <div style={{
                        backgroundColor: '#E6F9FF',
                        padding: '8px 16px',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#009688' }}>
                          {unidade.totalMedicos}
                        </span>
                        <span style={{ fontSize: '12px', color: '#5A5A5A', marginLeft: '8px' }}>
                          Profissionais
                        </span>
                      </div>
                    </div>
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
              {unidades.length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Total de Unidades
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
              {unidades.filter(u => u.ativo).length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Unidades Ativas
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
              {unidades.reduce((acc, u) => acc + u.totalPacientes, 0)}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Total de Pacientes
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
              {unidades.reduce((acc, u) => acc + u.totalMedicos, 0)}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Total de Profissionais
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
