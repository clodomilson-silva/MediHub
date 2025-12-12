import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function DetalhesUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      await carregarUsuario();
    };
    init();
  }, [id]);

  const carregarUsuario = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API
      // const response = await fetch(`/api/usuarios/${id}`, {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      
      // Dados mock
      const mockData = {
        id: 2,
        nome: 'Dr. João Santos',
        email: 'joao.santos@medihub.com.br',
        tipo: 'medico',
        crm: '12345-SP',
        telefone: '(11) 98888-8888',
        dataCadastro: '2024-02-15',
        ultimoAcesso: '2025-12-11',
        ativo: true,
        especialidade: 'Cardiologia',
        totalAtendimentos: 450,
        totalPacientes: 125,
        totalReceitas: 380,
        unidadesVinculadas: ['Unidade Central', 'Unidade Norte']
      };
      
      setUsuario(mockData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Integrar com API
      // const response = await fetch(`/api/usuarios/${id}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // if (!response.ok) throw new Error('Erro ao excluir usuário');

      console.log('Excluindo usuário:', id);
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário. Tente novamente.');
    }
  };

  const handleResetPassword = async () => {
    try {
      // TODO: Integrar com API
      // const response = await fetch(`/api/usuarios/${id}/reset-password`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // if (!response.ok) throw new Error('Erro ao resetar senha');

      console.log('Resetando senha do usuário:', id);
      alert('Senha resetada com sucesso! Nova senha enviada para o e-mail do usuário.');
      setShowResetPasswordModal(false);
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      alert('Erro ao resetar senha. Tente novamente.');
    }
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          Carregando...
        </div>
      </DashboardLayout>
    );
  }

  if (!usuario) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          Usuário não encontrado
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
            to="/usuarios"
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
            ← Voltar para Usuários
          </Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '40px' }}>
                  {getTipoIcon(usuario.tipo)}
                </span>
                <div>
                  <h1 style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold', 
                    color: '#006F6A'
                  }}>
                    {usuario.nome}
                  </h1>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{
                      backgroundColor: getTipoColor(usuario.tipo),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {getTipoLabel(usuario.tipo)}
                    </span>
                    <span style={{
                      backgroundColor: usuario.ativo ? '#006F6A' : '#D9D9D9',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ color: '#5A5A5A', marginTop: '8px' }}>
                Cadastrado em {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowResetPasswordModal(true)}
                style={{
                  backgroundColor: '#00A8A1',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔑 Resetar Senha
              </button>
              
              <Link
                to={`/usuarios/editar/${id}`}
                style={{
                  backgroundColor: '#009688',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                ✏️ Editar
              </Link>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Informações de Contato */}
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
              marginBottom: '20px'
            }}>
              Informações de Contato
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  📧 E-mail
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {usuario.email}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  📞 Telefone
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {usuario.telefone}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  🕐 Último Acesso
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>

          {/* Credenciais Profissionais */}
          {(usuario.crm || usuario.coren || usuario.matricula) && (
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
                marginBottom: '20px'
              }}>
                Credenciais Profissionais
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
              }}>
                {usuario.crm && (
                  <div>
                    <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                      🩺 CRM
                    </div>
                    <div style={{ fontWeight: '500', color: '#006F6A' }}>
                      {usuario.crm}
                    </div>
                  </div>
                )}
                
                {usuario.coren && (
                  <div>
                    <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                      🩺 COREN
                    </div>
                    <div style={{ fontWeight: '500', color: '#006F6A' }}>
                      {usuario.coren}
                    </div>
                  </div>
                )}
                
                {usuario.matricula && (
                  <div>
                    <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                      🆔 Matrícula
                    </div>
                    <div style={{ fontWeight: '500', color: '#006F6A' }}>
                      {usuario.matricula}
                    </div>
                  </div>
                )}
                
                {usuario.especialidade && (
                  <div>
                    <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                      🎓 Especialidade
                    </div>
                    <div style={{ fontWeight: '500', color: '#006F6A' }}>
                      {usuario.especialidade}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estatísticas (apenas para profissionais de saúde) */}
          {usuario.tipo !== 'paciente' && usuario.tipo !== 'admin' && (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#009688' }}>
                  {usuario.totalAtendimentos || 0}
                </div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
                  Total de Atendimentos
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
                  {usuario.totalPacientes || 0}
                </div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
                  Pacientes Atendidos
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
                  {usuario.totalReceitas || 0}
                </div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
                  Receitas Emitidas
                </div>
              </div>
            </div>
          )}

          {/* Unidades Vinculadas */}
          {usuario.unidadesVinculadas && usuario.unidadesVinculadas.length > 0 && (
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
                marginBottom: '16px'
              }}>
                Unidades Vinculadas
              </h2>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {usuario.unidadesVinculadas.map((unidade, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#E6F9FF',
                      color: '#006F6A',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    🏥 {unidade}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#006F6A',
                marginBottom: '16px'
              }}>
                Confirmar Exclusão
              </h3>
              
              <p style={{ color: '#5A5A5A', marginBottom: '24px' }}>
                Tem certeza que deseja excluir o usuário <strong>{usuario.nome}</strong>? 
                Esta ação não pode ser desfeita.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '2px solid #D9D9D9',
                    backgroundColor: 'white',
                    color: '#5A5A5A',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleDelete}
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
                  Excluir Usuário
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Reset de Senha */}
        {showResetPasswordModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#006F6A',
                marginBottom: '16px'
              }}>
                Resetar Senha
              </h3>
              
              <p style={{ color: '#5A5A5A', marginBottom: '24px' }}>
                Deseja resetar a senha do usuário <strong>{usuario.nome}</strong>? 
                Uma nova senha temporária será gerada e enviada para o e-mail cadastrado.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowResetPasswordModal(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '2px solid #D9D9D9',
                    backgroundColor: 'white',
                    color: '#5A5A5A',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleResetPassword}
                  style={{
                    backgroundColor: '#00A8A1',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Resetar Senha
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
