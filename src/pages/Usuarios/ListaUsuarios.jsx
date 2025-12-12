import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [loading, setLoading] = useState(true);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API
      // const response = await fetch('/api/usuarios', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      
      // Dados mock
      const mockData = [
        {
          id: 1,
          nome: 'Admin Sistema',
          email: 'admin@medihub.com.br',
          tipo: 'admin',
          telefone: '(11) 99999-9999',
          dataCadastro: '2024-01-10',
          ativo: true,
          ultimoAcesso: '2025-12-12'
        },
        {
          id: 2,
          nome: 'Dr. João Santos',
          email: 'joao.santos@medihub.com.br',
          tipo: 'medico',
          crm: '12345-SP',
          telefone: '(11) 98888-8888',
          dataCadastro: '2024-02-15',
          ativo: true,
          ultimoAcesso: '2025-12-11',
          especialidade: 'Cardiologia'
        },
        {
          id: 3,
          nome: 'Dra. Ana Costa',
          email: 'ana.costa@medihub.com.br',
          tipo: 'medico',
          crm: '67890-SP',
          telefone: '(11) 97777-7777',
          dataCadastro: '2024-03-20',
          ativo: true,
          ultimoAcesso: '2025-12-12',
          especialidade: 'Pediatria'
        },
        {
          id: 4,
          nome: 'Maria Silva',
          email: 'maria.silva@medihub.com.br',
          tipo: 'enfermeiro',
          coren: '123456-SP',
          telefone: '(11) 96666-6666',
          dataCadastro: '2024-04-10',
          ativo: true,
          ultimoAcesso: '2025-12-10'
        },
        {
          id: 5,
          nome: 'Carlos Oliveira',
          email: 'carlos.oliveira@medihub.com.br',
          tipo: 'profissional',
          matricula: 'MAT-2024-001',
          telefone: '(11) 95555-5555',
          dataCadastro: '2024-05-15',
          ativo: true,
          ultimoAcesso: '2025-12-09'
        },
        {
          id: 6,
          nome: 'José Pereira',
          email: 'jose.pereira@email.com',
          tipo: 'paciente',
          telefone: '(11) 94444-4444',
          dataCadastro: '2024-06-20',
          ativo: false,
          ultimoAcesso: '2025-11-15'
        }
      ];
      
      setUsuarios(mockData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await carregarUsuarios();
    };
    init();
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchFiltro = 
      usuario.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtro.toLowerCase());
    
    const matchTipo = filtroTipo === 'todos' || usuario.tipo === filtroTipo;
    
    return matchFiltro && matchTipo;
  });

  const getTipoLabel = (tipo) => {
    const tipos = {
      admin: 'Administrador',
      medico: 'Médico',
      enfermeiro: 'Enfermeiro',
      profissional: 'Profissional de Saúde',
      paciente: 'Paciente'
    };
    return tipos[tipo] || tipo;
  };

  const getTipoColor = (tipo) => {
    const cores = {
      admin: '#dc3545',
      medico: '#009688',
      enfermeiro: '#00A8A1',
      profissional: '#17C4C1',
      paciente: '#5A5A5A'
    };
    return cores[tipo] || '#5A5A5A';
  };

  const getTipoIcon = (tipo) => {
    const icones = {
      admin: '👑',
      medico: '👨‍⚕️',
      enfermeiro: '👩‍⚕️',
      profissional: '🩺',
      paciente: '🧑'
    };
    return icones[tipo] || '👤';
  };

  const contarPorTipo = (tipo) => {
    return usuarios.filter(u => u.tipo === tipo).length;
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <Link
          to="/dashboard"
          style={{
            color: '#009688',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}
        >
          ← Voltar para Dashboard
        </Link>

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
              Gerenciamento de Usuários
            </h1>
            <p style={{ color: '#5A5A5A' }}>
              Controle total dos usuários do sistema
            </p>
          </div>
          
          <Link
            to="/usuarios/novo"
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
            Novo Usuário
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
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
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
              <option value="todos">Todos os Tipos</option>
              <option value="admin">Administrador</option>
              <option value="medico">Médico</option>
              <option value="enfermeiro">Enfermeiro</option>
              <option value="profissional">Profissional de Saúde</option>
              <option value="paciente">Paciente</option>
            </select>
          </div>
        </div>

        {/* Estatísticas */}
        <div style={{ 
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
              {usuarios.length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Total de Usuários
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
              {contarPorTipo('admin')}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Administradores
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#009688' }}>
              {contarPorTipo('medico')}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Médicos
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
              {contarPorTipo('enfermeiro')}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Enfermeiros
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
              {contarPorTipo('profissional')}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Profissionais
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
              {usuarios.filter(u => u.ativo).length}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Usuários Ativos
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#5A5A5A' }}>
            Carregando usuários...
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
              Nenhum usuário encontrado
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {usuariosFiltrados.map((usuario) => (
              <Link
                key={usuario.id}
                to={`/usuario/${usuario.id}`}
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
                      <span style={{ fontSize: '32px' }}>
                        {getTipoIcon(usuario.tipo)}
                      </span>
                      <div>
                        <h3 style={{ 
                          fontSize: '20px', 
                          fontWeight: '600', 
                          color: '#006F6A',
                          marginBottom: '4px'
                        }}>
                          {usuario.nome}
                        </h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{
                            backgroundColor: getTipoColor(usuario.tipo),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {getTipoLabel(usuario.tipo)}
                          </span>
                          <span style={{
                            backgroundColor: usuario.ativo ? '#006F6A' : '#D9D9D9',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {usuario.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '12px',
                      color: '#5A5A5A',
                      fontSize: '14px'
                    }}>
                      <div>
                        <strong>📧 E-mail:</strong><br />
                        {usuario.email}
                      </div>
                      <div>
                        <strong>📞 Telefone:</strong><br />
                        {usuario.telefone}
                      </div>
                      {usuario.crm && (
                        <div>
                          <strong>🩺 CRM:</strong><br />
                          {usuario.crm}
                          {usuario.especialidade && ` - ${usuario.especialidade}`}
                        </div>
                      )}
                      {usuario.coren && (
                        <div>
                          <strong>🩺 COREN:</strong><br />
                          {usuario.coren}
                        </div>
                      )}
                      {usuario.matricula && (
                        <div>
                          <strong>🆔 Matrícula:</strong><br />
                          {usuario.matricula}
                        </div>
                      )}
                      <div>
                        <strong>📅 Cadastrado em:</strong><br />
                        {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <strong>🕐 Último acesso:</strong><br />
                        {new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')}
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
      </div>
    </DashboardLayout>
  );
}
