import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function CadastrarUnidade() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
    horarioFuncionamento: '',
    ativo: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      if (isEdit) {
        await carregarUnidade();
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        ativo: true
      };
      
      setFormData(mockData);
    } catch (error) {
      console.error('Erro ao carregar unidade:', error);
      setError('Erro ao carregar dados da unidade');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.nome || !formData.endereco || !formData.cidade || !formData.estado || !formData.cep) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      // TODO: Integrar com API
      // const url = isEdit ? `/api/unidades/${id}` : '/api/unidades';
      // const method = isEdit ? 'PUT' : 'POST';
      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // if (!response.ok) throw new Error('Erro ao salvar unidade');

      console.log('Salvando unidade:', formData);
      
      // Simular sucesso
      setTimeout(() => {
        navigate('/unidades');
      }, 500);
    } catch (error) {
      console.error('Erro ao salvar unidade:', error);
      setError('Erro ao salvar unidade. Tente novamente.');
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
          
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#006F6A',
            marginBottom: '8px'
          }}>
            {isEdit ? 'Editar Unidade' : 'Nova Unidade'}
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            {isEdit ? 'Atualize as informações da unidade de saúde' : 'Cadastre uma nova unidade de saúde'}
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
                    Nome da Unidade *
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
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 0000-0000"
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
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="unidade@medihub.com.br"
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
            </div>

            {/* Endereço */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#006F6A',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #E6F9FF'
              }}>
                Endereço
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#5A5A5A'
                  }}>
                    Endereço Completo *
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                    placeholder="Rua, número, complemento"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #D9D9D9',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#5A5A5A'
                    }}>
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
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
                      Estado *
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
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
                      <option value="">UF</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#5A5A5A'
                    }}>
                      CEP *
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      required
                      placeholder="00000-000"
                      maxLength="9"
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
            </div>

            {/* Funcionamento */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#006F6A',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #E6F9FF'
              }}>
                Funcionamento
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#5A5A5A'
                  }}>
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    name="horarioFuncionamento"
                    value={formData.horarioFuncionamento}
                    onChange={handleChange}
                    placeholder="Ex: Segunda a Sexta: 7h às 19h"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #D9D9D9',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

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
                    Unidade ativa (disponível para atendimentos)
                  </label>
                </div>
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
                to="/unidades"
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
                {loading ? 'Salvando...' : (isEdit ? 'Atualizar Unidade' : 'Cadastrar Unidade')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
