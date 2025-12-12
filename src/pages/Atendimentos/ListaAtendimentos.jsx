import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ListaAtendimentos() {
  const { user } = useAuth();
  const [atendimentos, setAtendimentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const [novoAtendimento, setNovoAtendimento] = useState({
    pacienteId: '',
    unidadeId: '',
    tipo: 'consulta',
    dataAtendimento: new Date().toISOString().slice(0, 16),
    queixaPrincipal: '',
    historiaDoenca: '',
    exameFisico: '',
    hipoteseDiagnostica: '',
    conduta: '',
    observacoes: '',
    status: 'concluido'
  });

  const carregarAtendimentos = async () => {
    // Mock data - substituir por chamada à API
    const mockAtendimentos = [
      {
        id: 1,
        paciente: { nome: 'Maria Silva', cpf: '123.456.789-00' },
        medico: { nome: 'Dr. João Santos' },
        unidade: { nome: 'Unidade Central' },
        tipo: 'consulta',
        dataAtendimento: '2025-12-10T10:00:00',
        queixaPrincipal: 'Dor de cabeça constante',
        hipoteseDiagnostica: 'Enxaqueca',
        status: 'concluido'
      },
      {
        id: 2,
        paciente: { nome: 'José Oliveira', cpf: '987.654.321-00' },
        medico: { nome: 'Dr. João Santos' },
        unidade: { nome: 'Unidade Norte' },
        tipo: 'retorno',
        dataAtendimento: '2025-12-11T14:30:00',
        queixaPrincipal: 'Retorno hipertensão',
        hipoteseDiagnostica: 'Hipertensão controlada',
        status: 'concluido'
      }
    ];
    setAtendimentos(mockAtendimentos);
  };

  const carregarPacientes = async () => {
    // Mock data
    setPacientes([
      { id: 1, nome: 'Maria Silva', cpf: '123.456.789-00' },
      { id: 2, nome: 'José Oliveira', cpf: '987.654.321-00' }
    ]);
  };

  const carregarUnidades = async () => {
    // Mock data
    setUnidades([
      { id: 1, nome: 'Unidade Central' },
      { id: 2, nome: 'Unidade Norte' }
    ]);
  };

  useEffect(() => {
    const init = async () => {
      await carregarAtendimentos();
      await carregarPacientes();
      await carregarUnidades();
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui faria a chamada à API
    console.log('Novo atendimento:', novoAtendimento);
    setShowModal(false);
    carregarAtendimentos();
  };

  const formatarData = (dataISO) => {
    return new Date(dataISO).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const atendimentosFiltrados = atendimentos.filter(atd => {
    const matchNome = atd.paciente.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchData = filtroData ? atd.dataAtendimento.startsWith(filtroData) : true;
    return matchNome && matchData;
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#006F6A', marginBottom: '8px' }}>
            🩺 Atendimentos
          </h1>
          <p style={{ color: '#5A5A5A' }}>
            Gerencie consultas e atendimentos médicos
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
            + Novo Atendimento
          </button>
        )}
      </div>

      {/* Filtros */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        <div>
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
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontSize: '14px' }}>
            Filtrar por Data
          </label>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #D9D9D9',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Lista de Atendimentos */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {atendimentosFiltrados.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '48px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#5A5A5A'
          }}>
            Nenhum atendimento encontrado
          </div>
        ) : (
          atendimentosFiltrados.map((atd) => (
            <div
              key={atd.id}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#006F6A', marginBottom: '4px' }}>
                    {atd.paciente.nome}
                  </h3>
                  <p style={{ color: '#5A5A5A', fontSize: '14px' }}>CPF: {atd.paciente.cpf}</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    backgroundColor: atd.tipo === 'emergencia' ? '#ff5252' : atd.tipo === 'retorno' ? '#17C4C1' : '#009688',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {atd.tipo}
                  </span>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#5A5A5A' }}>Data/Hora</p>
                  <p style={{ fontWeight: '500', color: '#006F6A' }}>{formatarData(atd.dataAtendimento)}</p>
                </div>
                
                <div>
                  <p style={{ fontSize: '12px', color: '#5A5A5A' }}>Médico</p>
                  <p style={{ fontWeight: '500' }}>{atd.medico.nome}</p>
                </div>
                
                <div>
                  <p style={{ fontSize: '12px', color: '#5A5A5A' }}>Unidade</p>
                  <p style={{ fontWeight: '500' }}>{atd.unidade.nome}</p>
                </div>
                
                <div>
                  <p style={{ fontSize: '12px', color: '#5A5A5A' }}>Status</p>
                  <p style={{ fontWeight: '500', color: atd.status === 'concluido' ? '#009688' : '#5A5A5A' }}>
                    {atd.status === 'concluido' ? 'Concluído' : atd.status}
                  </p>
                </div>
              </div>

              <div style={{ 
                borderTop: '1px solid #D9D9D9', 
                paddingTop: '16px',
                marginTop: '16px'
              }}>
                <p style={{ fontSize: '12px', color: '#5A5A5A', marginBottom: '4px' }}>Queixa Principal</p>
                <p style={{ marginBottom: '12px' }}>{atd.queixaPrincipal}</p>
                
                <p style={{ fontSize: '12px', color: '#5A5A5A', marginBottom: '4px' }}>Hipótese Diagnóstica</p>
                <p style={{ fontWeight: '500', color: '#006F6A' }}>{atd.hipoteseDiagnostica}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Novo Atendimento */}
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
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '32px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#006F6A', marginBottom: '24px' }}>
              Novo Atendimento
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Paciente e Unidade */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Paciente *
                    </label>
                    <select
                      required
                      value={novoAtendimento.pacienteId}
                      onChange={(e) => setNovoAtendimento({...novoAtendimento, pacienteId: e.target.value})}
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
                      Unidade *
                    </label>
                    <select
                      required
                      value={novoAtendimento.unidadeId}
                      onChange={(e) => setNovoAtendimento({...novoAtendimento, unidadeId: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Selecione a unidade</option>
                      {unidades.map(u => (
                        <option key={u.id} value={u.id}>{u.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tipo e Data */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Tipo de Atendimento *
                    </label>
                    <select
                      required
                      value={novoAtendimento.tipo}
                      onChange={(e) => setNovoAtendimento({...novoAtendimento, tipo: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="consulta">Consulta</option>
                      <option value="retorno">Retorno</option>
                      <option value="emergencia">Emergência</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Data/Hora do Atendimento *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={novoAtendimento.dataAtendimento}
                      onChange={(e) => setNovoAtendimento({...novoAtendimento, dataAtendimento: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Queixa Principal */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Queixa Principal *
                  </label>
                  <textarea
                    required
                    value={novoAtendimento.queixaPrincipal}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, queixaPrincipal: e.target.value})}
                    rows="2"
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

                {/* História da Doença */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    História da Doença Atual
                  </label>
                  <textarea
                    value={novoAtendimento.historiaDoenca}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, historiaDoenca: e.target.value})}
                    rows="3"
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

                {/* Exame Físico */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Exame Físico
                  </label>
                  <textarea
                    value={novoAtendimento.exameFisico}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, exameFisico: e.target.value})}
                    rows="3"
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

                {/* Hipótese Diagnóstica */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Hipótese Diagnóstica *
                  </label>
                  <textarea
                    required
                    value={novoAtendimento.hipoteseDiagnostica}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, hipoteseDiagnostica: e.target.value})}
                    rows="2"
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

                {/* Conduta */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Conduta
                  </label>
                  <textarea
                    value={novoAtendimento.conduta}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, conduta: e.target.value})}
                    rows="3"
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

                {/* Observações */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Observações
                  </label>
                  <textarea
                    value={novoAtendimento.observacoes}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, observacoes: e.target.value})}
                    rows="2"
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
                  Salvar Atendimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
