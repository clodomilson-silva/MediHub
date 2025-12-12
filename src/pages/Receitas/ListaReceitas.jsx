import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function ListaReceitas() {
  const { user } = useAuth();
  const [receitas, setReceitas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [medicamentos, setMedicamentos] = useState([{ nome: '', dosagem: '', frequencia: '', duracao: '' }]);
  const [novaReceita, setNovaReceita] = useState({
    pacienteId: '',
    atendimentoId: '',
    observacoes: '',
    dataValidade: ''
  });

  const carregarReceitas = async () => {
    // Mock data - substituir por chamada à API
    const mockReceitas = [
      {
        id: 1,
        paciente: { nome: 'Maria Silva', cpf: '123.456.789-00' },
        medico: { nome: 'Dr. João Santos', crm: '12345-SP' },
        atendimento: { tipo: 'consulta', data: '2025-12-10' },
        medicamentos: [
          { nome: 'Paracetamol 750mg', dosagem: '1 comprimido', frequencia: '8/8h', duracao: '5 dias' },
          { nome: 'Dipirona 500mg', dosagem: '1 comprimido', frequencia: 'Se dor', duracao: '5 dias' }
        ],
        dataEmissao: '2025-12-10',
        dataValidade: '2026-01-10',
        observacoes: 'Tomar com alimentos'
      },
      {
        id: 2,
        paciente: { nome: 'José Oliveira', cpf: '987.654.321-00' },
        medico: { nome: 'Dr. João Santos', crm: '12345-SP' },
        atendimento: { tipo: 'retorno', data: '2025-12-11' },
        medicamentos: [
          { nome: 'Losartana 50mg', dosagem: '1 comprimido', frequencia: '1x/dia (manhã)', duracao: '30 dias' }
        ],
        dataEmissao: '2025-12-11',
        dataValidade: '2026-01-11',
        observacoes: 'Uso contínuo'
      }
    ];
    setReceitas(mockReceitas);
  };

  const carregarPacientes = async () => {
    setPacientes([
      { id: 1, nome: 'Maria Silva', cpf: '123.456.789-00' },
      { id: 2, nome: 'José Oliveira', cpf: '987.654.321-00' }
    ]);
  };

  const carregarAtendimentos = async () => {
    setAtendimentos([
      { id: 1, pacienteNome: 'Maria Silva', tipo: 'Consulta', data: '2025-12-10' },
      { id: 2, pacienteNome: 'José Oliveira', tipo: 'Retorno', data: '2025-12-11' }
    ]);
  };

  useEffect(() => {
    const init = async () => {
      await carregarReceitas();
      await carregarPacientes();
      await carregarAtendimentos();
      // Definir data de validade padrão (30 dias a partir de hoje)
      const dataDefault = new Date();
      dataDefault.setDate(dataDefault.getDate() + 30);
      setNovaReceita(prev => ({
        ...prev,
        dataValidade: dataDefault.toISOString().slice(0, 10)
      }));
    };
    init();
  }, []);

  const adicionarMedicamento = () => {
    setMedicamentos([...medicamentos, { nome: '', dosagem: '', frequencia: '', duracao: '' }]);
  };

  const removerMedicamento = (index) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== index));
  };

  const atualizarMedicamento = (index, campo, valor) => {
    const novosMedicamentos = [...medicamentos];
    novosMedicamentos[index][campo] = valor;
    setMedicamentos(novosMedicamentos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const receitaCompleta = {
      ...novaReceita,
      medicamentos: JSON.stringify(medicamentos)
    };
    console.log('Nova receita:', receitaCompleta);
    setShowModal(false);
    carregarReceitas();
  };

  const imprimirReceita = (receita) => {
    console.log('Imprimir receita:', receita.id);
    // Implementar funcionalidade de impressão
  };

  const receitasFiltradas = receitas.filter(rec =>
    rec.paciente.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
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
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#006F6A', marginBottom: '8px' }}>
              📋 Receitas Médicas
            </h1>
            <p style={{ color: '#5A5A5A' }}>
              Emita e gerencie prescrições médicas
            </p>
          </div>
        
        {user?.tipo !== 'paciente' && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#009688',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#00A8A1'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#009688'}
          >
            + Nova Receita
          </button>
        )}
      </div>

      {/* Filtro */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontSize: '14px' }}>
          Buscar por Paciente
        </label>
        <input
          type="text"
          placeholder="Nome do paciente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #D9D9D9',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Lista de Receitas */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {receitasFiltradas.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '48px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#5A5A5A'
          }}>
            Nenhuma receita encontrada
          </div>
        ) : (
          receitasFiltradas.map((receita) => (
            <div
              key={receita.id}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
            >
              {/* Cabeçalho da Receita */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '2px solid #009688'
              }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#006F6A', marginBottom: '4px' }}>
                    {receita.paciente.nome}
                  </h3>
                  <p style={{ color: '#5A5A5A', fontSize: '14px' }}>CPF: {receita.paciente.cpf}</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#5A5A5A' }}>Receita #{receita.id}</p>
                  <p style={{ fontSize: '12px', color: '#5A5A5A' }}>
                    Emitida em: {new Date(receita.dataEmissao).toLocaleDateString('pt-BR')}
                  </p>
                  <p style={{ fontSize: '12px', color: '#ff5252', fontWeight: '500' }}>
                    Válida até: {new Date(receita.dataValidade).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Informações do Médico */}
              <div style={{ 
                backgroundColor: '#E6F9FF',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#006F6A' }}>
                  {receita.medico.nome}
                </p>
                <p style={{ fontSize: '12px', color: '#5A5A5A' }}>CRM: {receita.medico.crm}</p>
              </div>

              {/* Medicamentos */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#006F6A', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  💊 Medicamentos Prescritos
                </h4>
                
                {receita.medicamentos.map((med, index) => (
                  <div 
                    key={index}
                    style={{
                      backgroundColor: '#F5F6F7',
                      padding: '16px',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      borderLeft: '4px solid #009688'
                    }}
                  >
                    <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '8px', color: '#006F6A' }}>
                      {med.nome}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#5A5A5A', textTransform: 'uppercase' }}>Dosagem</p>
                        <p style={{ fontSize: '14px', fontWeight: '500' }}>{med.dosagem}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#5A5A5A', textTransform: 'uppercase' }}>Frequência</p>
                        <p style={{ fontSize: '14px', fontWeight: '500' }}>{med.frequencia}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#5A5A5A', textTransform: 'uppercase' }}>Duração</p>
                        <p style={{ fontSize: '14px', fontWeight: '500' }}>{med.duracao}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Observações */}
              {receita.observacoes && (
                <div style={{ 
                  backgroundColor: '#FFF8E1',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  borderLeft: '4px solid #FFC107'
                }}>
                  <p style={{ fontSize: '12px', color: '#5A5A5A', marginBottom: '4px', fontWeight: '600' }}>
                    ⚠️ Observações
                  </p>
                  <p style={{ fontSize: '14px' }}>{receita.observacoes}</p>
                </div>
              )}

              {/* Botões */}
              {user?.tipo !== 'paciente' && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => imprimirReceita(receita)}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #009688',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#009688',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    🖨️ Imprimir
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Nova Receita */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '32px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#006F6A', marginBottom: '24px' }}>
              Nova Receita Médica
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Paciente e Atendimento */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Paciente *
                    </label>
                    <select
                      required
                      value={novaReceita.pacienteId}
                      onChange={(e) => setNovaReceita({...novaReceita, pacienteId: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Selecione o paciente</option>
                      {pacientes.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} - {p.cpf}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Atendimento *
                    </label>
                    <select
                      required
                      value={novaReceita.atendimentoId}
                      onChange={(e) => setNovaReceita({...novaReceita, atendimentoId: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Selecione o atendimento</option>
                      {atendimentos.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.pacienteNome} - {a.tipo} - {a.data}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Data de Validade */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Data de Validade *
                  </label>
                  <input
                    type="date"
                    required
                    value={novaReceita.dataValidade}
                    onChange={(e) => setNovaReceita({...novaReceita, dataValidade: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D9D9D9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Medicamentos */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ fontWeight: '600', fontSize: '16px', color: '#006F6A' }}>
                      💊 Medicamentos
                    </label>
                    <button
                      type="button"
                      onClick={adicionarMedicamento}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#17C4C1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      + Adicionar Medicamento
                    </button>
                  </div>

                  {medicamentos.map((med, index) => (
                    <div 
                      key={index}
                      style={{
                        backgroundColor: '#F5F6F7',
                        padding: '16px',
                        borderRadius: '6px',
                        marginBottom: '12px',
                        border: '1px solid #D9D9D9'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#006F6A' }}>
                          Medicamento {index + 1}
                        </h4>
                        {medicamentos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removerMedicamento(index)}
                            style={{
                              padding: '4px 12px',
                              backgroundColor: '#ff5252',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Remover
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Nome do medicamento *"
                          required
                          value={med.nome}
                          onChange={(e) => atualizarMedicamento(index, 'nome', e.target.value)}
                          style={{
                            padding: '12px',
                            border: '1px solid #D9D9D9',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          <input
                            type="text"
                            placeholder="Dosagem *"
                            required
                            value={med.dosagem}
                            onChange={(e) => atualizarMedicamento(index, 'dosagem', e.target.value)}
                            style={{
                              padding: '12px',
                              border: '1px solid #D9D9D9',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Frequência *"
                            required
                            value={med.frequencia}
                            onChange={(e) => atualizarMedicamento(index, 'frequencia', e.target.value)}
                            style={{
                              padding: '12px',
                              border: '1px solid #D9D9D9',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Duração *"
                            required
                            value={med.duracao}
                            onChange={(e) => atualizarMedicamento(index, 'duracao', e.target.value)}
                            style={{
                              padding: '12px',
                              border: '1px solid #D9D9D9',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Observações */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Observações
                  </label>
                  <textarea
                    value={novaReceita.observacoes}
                    onChange={(e) => setNovaReceita({...novaReceita, observacoes: e.target.value})}
                    rows="3"
                    placeholder="Ex: Tomar com alimentos, evitar bebidas alcoólicas..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D9D9D9',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Botões */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #D9D9D9'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #D9D9D9',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#5A5A5A',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#009688',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Emitir Receita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
