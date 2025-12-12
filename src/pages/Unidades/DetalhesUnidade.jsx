import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function DetalhesUnidade() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unidade, setUnidade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      await carregarUnidade();
    };
    init();
  }, [id]);

  const carregarUnidade = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API
      // const response = await fetch(`/api/unidades/${id}`, {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // const data = await response.json();
      
      // Dados mock
      const mockData = {
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
        dataCadastro: '2024-01-15',
        totalPacientes: 1250,
        totalMedicos: 15,
        totalEnfermeiros: 8,
        totalProfissionais: 5,
        atendimentosMes: 450,
        especialidades: ['Clínico Geral', 'Pediatria', 'Cardiologia', 'Ginecologia']
      };
      
      setUnidade(mockData);
    } catch (error) {
      console.error('Erro ao carregar unidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Integrar com API
      // const response = await fetch(`/api/unidades/${id}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });
      // if (!response.ok) throw new Error('Erro ao excluir unidade');

      console.log('Excluindo unidade:', id);
      navigate('/unidades');
    } catch (error) {
      console.error('Erro ao excluir unidade:', error);
      alert('Erro ao excluir unidade. Tente novamente.');
    }
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

  if (!unidade) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          Unidade não encontrada
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
            to="/unidades"
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
            ← Voltar para Unidades
          </Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#006F6A'
                }}>
                  {unidade.nome}
                </h1>
                <span style={{
                  backgroundColor: unidade.ativo ? '#006F6A' : '#D9D9D9',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {unidade.ativo ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <p style={{ color: '#5A5A5A' }}>
                Cadastrada em {new Date(unidade.dataCadastro).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                to={`/unidades/editar/${id}`}
                style={{
                  backgroundColor: '#009688',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                ✏️ Editar
              </Link>
              
              <button
                onClick={() => setShowDeleteModal(true)}
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
                🗑️ Excluir
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Informações Principais */}
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
              Informações da Unidade
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  📍 Endereço
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {unidade.endereco}
                </div>
                <div style={{ color: '#5A5A5A', fontSize: '14px' }}>
                  {unidade.cidade} - {unidade.estado}
                </div>
                <div style={{ color: '#5A5A5A', fontSize: '14px' }}>
                  CEP: {unidade.cep}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  📞 Contato
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {unidade.telefone}
                </div>
                <div style={{ color: '#5A5A5A', fontSize: '14px' }}>
                  {unidade.email}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  🕐 Horário de Funcionamento
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {unidade.horarioFuncionamento}
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
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
                {unidade.totalPacientes}
              </div>
              <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
                Pacientes Cadastrados
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
                {unidade.totalMedicos}
              </div>
              <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
                Médicos
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
                {unidade.totalEnfermeiros}
              </div>
              <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
                Enfermeiros
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
                {unidade.totalProfissionais}
              </div>
              <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
                Outros Profissionais
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#009688' }}>
                {unidade.atendimentosMes}
              </div>
              <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
                Atendimentos (Este Mês)
              </div>
            </div>
          </div>

          {/* Especialidades */}
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
              Especialidades Disponíveis
            </h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {unidade.especialidades.map((esp, index) => (
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
                  {esp}
                </span>
              ))}
            </div>
          </div>
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
                Tem certeza que deseja excluir a unidade <strong>{unidade.nome}</strong>? 
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
                  Excluir Unidade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
