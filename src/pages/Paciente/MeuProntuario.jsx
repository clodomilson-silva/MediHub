import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { api } from '../../services/api';

export default function MeuProntuario() {
  useAuth();
  const [prontuario, setProntuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await carregarProntuario();
    };
    init();
  }, []);

  const carregarProntuario = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pacientes/meu/prontuario');
      const data = response.data;
      
      // Calcular idade
      const calcularIdade = (dataNascimento) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }
        return idade;
      };
      
      // Formatar dados de vacinas
      const vacinasMap = {};
      data.vacinas?.forEach(vacina => {
        if (vacina.nome.toLowerCase().includes('covid')) vacinasMap.vacinaCovid = true;
        if (vacina.nome.toLowerCase().includes('gripe')) vacinasMap.vacinaGripe = true;
        if (vacina.nome.toLowerCase().includes('hepatite')) vacinasMap.vacinaHepatite = true;
      });
      
      const prontuarioFormatado = {
        ...data,
        idade: calcularIdade(data.dataNascimento),
        sexo: data.sexo === 'M' ? 'Masculino' : data.sexo === 'F' ? 'Feminino' : 'Outro',
        vacinaCovid: vacinasMap.vacinaCovid || false,
        vacinaGripe: vacinasMap.vacinaGripe || false,
        vacinaHepatite: vacinasMap.vacinaHepatite || false,
        ultimaVacinacao: data.vacinas?.[0]?.dataAplicacao || null,
        unidadesPrincipal: data.unidadesVinculadas?.[0]?.nome || 'Não informado',
        unidadesVinculadas: data.unidadesVinculadas?.map(u => u.nome) || [],
        totalConsultas: data.estatisticas?.totalConsultas || 0,
        totalExames: data.estatisticas?.totalExames || 0,
        totalReceitas: data.estatisticas?.totalReceitas || 0,
        proximaConsulta: data.proximaConsulta?.dataAtendimento || null,
        proximaConsultaMedico: data.proximaConsulta?.medicoNome || null,
        proximaConsultaUnidade: data.proximaConsulta?.unidadeNome || null,
      };
      
      setProntuario(prontuarioFormatado);
    } catch (error) {
      console.error('Erro ao carregar prontuário:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          Carregando prontuário...
        </div>
      </DashboardLayout>
    );
  }

  if (!prontuario) {
    return (
      <DashboardLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          Prontuário não encontrado
        </div>
      </DashboardLayout>
    );
  }

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
            📋 Meu Prontuário
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            Suas informações de saúde e histórico médico
          </p>
        </div>

        {/* Cards de Estatísticas Rápidas */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#009688' }}>
              {prontuario.totalConsultas}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Consultas Realizadas
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
              {prontuario.totalExames}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Exames Realizados
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
              {prontuario.totalReceitas}
            </div>
            <div style={{ color: '#5A5A5A', fontSize: '14px', marginTop: '4px' }}>
              Receitas Emitidas
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Dados Pessoais */}
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
              👤 Dados Pessoais
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  Nome Completo
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {prontuario.nome}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  CPF
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {prontuario.cpf}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  Data de Nascimento
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {new Date(prontuario.dataNascimento).toLocaleDateString('pt-BR')} ({prontuario.idade} anos)
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  Sexo
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {prontuario.sexo}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  Telefone
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {prontuario.telefone}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  E-mail
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {prontuario.email}
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
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
              📍 Endereço
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  Endereço Completo
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {prontuario.endereco}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  Cidade/Estado
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {prontuario.cidade} - {prontuario.estado}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                  CEP
                </div>
                <div style={{ fontWeight: '500', color: '#006F6A' }}>
                  {prontuario.cep}
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Saúde */}
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
              🩺 Informações de Saúde
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gap: '20px'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                    Tipo Sanguíneo
                  </div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#dc3545',
                    fontSize: '18px'
                  }}>
                    🩸 {prontuario.tipoSanguineo}
                  </div>
                </div>
                
                <div>
                  <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                    Condições
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {prontuario.hipertenso && (
                      <span style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        Hipertenso
                      </span>
                    )}
                    {prontuario.diabetico && (
                      <span style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        Diabético
                      </span>
                    )}
                    {prontuario.fumante && (
                      <span style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        Fumante
                      </span>
                    )}
                    {!prontuario.hipertenso && !prontuario.diabetico && !prontuario.fumante && (
                      <span style={{ color: '#5A5A5A', fontSize: '14px' }}>
                        Nenhuma condição registrada
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {prontuario.alergias && (
                <div>
                  <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                    ⚠️ Alergias
                  </div>
                  <div style={{ 
                    fontWeight: '500', 
                    color: '#dc3545',
                    backgroundColor: '#fee',
                    padding: '12px',
                    borderRadius: '8px'
                  }}>
                    {prontuario.alergias}
                  </div>
                </div>
              )}
              
              {prontuario.doencasCronicas && (
                <div>
                  <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                    Doenças Crônicas
                  </div>
                  <div style={{ fontWeight: '500', color: '#006F6A' }}>
                    {prontuario.doencasCronicas}
                  </div>
                </div>
              )}
              
              {prontuario.medicamentoContinuo && prontuario.medicamentosContinuos && (
                <div>
                  <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                    💊 Medicamentos de Uso Contínuo
                  </div>
                  <div style={{ 
                    fontWeight: '500', 
                    color: '#006F6A',
                    backgroundColor: '#E6F9FF',
                    padding: '12px',
                    borderRadius: '8px'
                  }}>
                    {prontuario.medicamentosContinuos}
                  </div>
                </div>
              )}
              
              {prontuario.cirurgiasAnteriores && (
                <div>
                  <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>
                    Cirurgias Anteriores
                  </div>
                  <div style={{ fontWeight: '500', color: '#006F6A' }}>
                    {prontuario.cirurgiasAnteriores}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vacinação */}
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
              💉 Vacinação
            </h2>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {prontuario.vacinaCovid && (
                <span style={{
                  backgroundColor: '#E6F9FF',
                  color: '#006F6A',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  ✓ COVID-19
                </span>
              )}
              {prontuario.vacinaGripe && (
                <span style={{
                  backgroundColor: '#E6F9FF',
                  color: '#006F6A',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  ✓ Gripe
                </span>
              )}
              {prontuario.vacinaHepatite && (
                <span style={{
                  backgroundColor: '#E6F9FF',
                  color: '#006F6A',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  ✓ Hepatite
                </span>
              )}
            </div>
            
            {prontuario.ultimaVacinacao && (
              <div style={{ color: '#5A5A5A', fontSize: '14px' }}>
                Última vacinação: {new Date(prontuario.ultimaVacinacao).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>

          {/* Unidades de Atendimento */}
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
              🏥 Unidades de Atendimento
            </h2>
            
            <div>
              <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '8px' }}>
                Unidade Principal: <strong style={{ color: '#006F6A' }}>{prontuario.unidadesPrincipal}</strong>
              </div>
              
              <div style={{ color: '#5A5A5A', fontSize: '14px', marginBottom: '8px' }}>
                Unidades Vinculadas:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {prontuario.unidadesVinculadas.map((unidade, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#E6F9FF',
                      color: '#006F6A',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '13px'
                    }}
                  >
                    {unidade}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Próximas Consultas */}
          {prontuario.proximaConsulta && (
            <div style={{
              backgroundColor: '#E6F9FF',
              padding: '24px',
              borderRadius: '12px',
              border: '2px solid #17C4C1'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#006F6A',
                marginBottom: '12px'
              }}>
                📅 Próxima Consulta Agendada
              </h2>
              
              <div style={{ fontSize: '16px', color: '#006F6A', fontWeight: '500' }}>
                {new Date(prontuario.proximaConsulta).toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
