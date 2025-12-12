import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function CadastrarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'profissional',
    telefone: '',
    crm: '',
    coren: '',
    matricula: '',
    ativo: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      if (isEdit) {
        await carregarUsuario();
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        ativo: true
      };
      
      setFormData({ ...mockData, senha: '', confirmarSenha: '' });
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.nome || !formData.email || !formData.tipo) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    // Validar senha apenas no cadastro
    if (!isEdit) {
      if (!formData.senha || formData.senha.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres');
        return;
      }
      if (formData.senha !== formData.confirmarSenha) {
        setError('As senhas não coincidem');
        return;
      }
    } else if (formData.senha && formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    // Validar credenciais profissionais
    if (formData.tipo === 'medico' && !formData.crm) {
      setError('CRM é obrigatório para médicos');
      return;
    }
    if (formData.tipo === 'enfermeiro' && !formData.coren) {
      setError('COREN é obrigatório para enfermeiros');
      return;
    }
    if (formData.tipo === 'profissional' && !formData.matricula) {
      setError('Matrícula é obrigatória para profissionais de saúde');
      return;
    }

    try {
      setLoading(true);
      
      // TODO: Integrar com API
      // const url = isEdit ? `/api/usuarios/${id}` : '/api/usuarios';
      // const method = isEdit ? 'PUT' : 'POST';
      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // if (!response.ok) throw new Error('Erro ao salvar usuário');

      console.log('Salvando usuário:', formData);
      
      // Simular sucesso
      setTimeout(() => {
        navigate('/usuarios');
      }, 500);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setError('Erro ao salvar usuário. Tente novamente.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading && isEdit) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          Carregando...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
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
          
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#006F6A',
            marginBottom: '8px'
          }}>
            {isEdit ? 'Editar Usuário' : 'Novo Usuário'}
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            {isEdit ? 'Atualize as informações do usuário' : 'Cadastre um novo usuário no sistema'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                border: '1px solid #fcc'
              }}>
                {error}
              </div>
            )}

            {/* Informações Básicas */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#006F6A',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #E6F9FF'
              }}>
                Informações Básicas
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#5A5A5A'
                  }}>
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #D9D9D9',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#5A5A5A'
                    }}>
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#5A5A5A'
                    }}>
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#5A5A5A'
                  }}>
                    Tipo de Usuário *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #D9D9D9',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="admin">Administrador</option>
                    <option value="medico">Médico</option>
                    <option value="enfermeiro">Enfermeiro</option>
                    <option value="profissional">Profissional de Saúde</option>
                    <option value="paciente">Paciente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Credenciais Profissionais */}
            {(formData.tipo === 'medico' || formData.tipo === 'enfermeiro' || formData.tipo === 'profissional') && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#006F6A',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #E6F9FF'
                }}>
                  Credenciais Profissionais
                </h2>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {formData.tipo === 'medico' && (
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500',
                        color: '#5A5A5A'
                      }}>
                        CRM *
                      </label>
                      <input
                        type="text"
                        name="crm"
                        value={formData.crm}
                        onChange={handleChange}
                        required
                        placeholder="Ex: 12345-SP"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #D9D9D9',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  )}

                  {formData.tipo === 'enfermeiro' && (
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500',
                        color: '#5A5A5A'
                      }}>
                        COREN *
                      </label>
                      <input
                        type="text"
                        name="coren"
                        value={formData.coren}
                        onChange={handleChange}
                        required
                        placeholder="Ex: 123456-SP"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #D9D9D9',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  )}

                  {formData.tipo === 'profissional' && (
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500',
                        color: '#5A5A5A'
                      }}>
                        Matrícula *
                      </label>
                      <input
                        type="text"
                        name="matricula"
                        value={formData.matricula}
                        onChange={handleChange}
                        required
                        placeholder="Ex: MAT-2024-001"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #D9D9D9',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Senha */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#006F6A',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #E6F9FF'
              }}>
                {isEdit ? 'Alterar Senha (deixe em branco para manter a atual)' : 'Senha de Acesso'}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#5A5A5A'
                  }}>
                    Senha {!isEdit && '*'}
                  </label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required={!isEdit}
                    minLength="6"
                    placeholder="Mínimo 6 caracteres"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #D9D9D9',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#5A5A5A'
                  }}>
                    Confirmar Senha {!isEdit && '*'}
                  </label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required={!isEdit}
                    placeholder="Repita a senha"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #D9D9D9',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#E6F9FF',
                borderRadius: '8px'
              }}>
                <input
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <label 
                  htmlFor="ativo"
                  style={{ 
                    fontWeight: '500',
                    color: '#006F6A',
                    cursor: 'pointer'
                  }}
                >
                  Usuário ativo (pode acessar o sistema)
                </label>
              </div>
            </div>

            {/* Botões */}
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              justifyContent: 'flex-end',
              paddingTop: '24px',
              borderTop: '1px solid #E6F9FF'
            }}>
              <Link
                to="/usuarios"
                style={{
                  padding: '12px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  border: '2px solid #D9D9D9',
                  color: '#5A5A5A',
                  backgroundColor: 'white'
                }}
              >
                Cancelar
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#D9D9D9' : '#009688',
                  color: 'white',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Salvando...' : (isEdit ? 'Atualizar Usuário' : 'Cadastrar Usuário')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
