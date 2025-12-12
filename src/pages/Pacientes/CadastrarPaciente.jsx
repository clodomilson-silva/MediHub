import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function CadastrarPaciente() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState('busca'); // busca, novo, vinculacao
  const [cpfBusca, setCpfBusca] = useState('');
  const [pacienteExistente, setPacienteExistente] = useState(null);
  const [formData, setFormData] = useState({
    // Dados Pessoais
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    
    // Dados de Saúde - Questionário
    tipoSanguineo: '',
    hipertenso: false,
    diabetico: false,
    fumante: false,
    alergias: '',
    medicamentoContinuo: false,
    medicamentosContinuos: '',
    doencasCronicas: '',
    cirurgiasAnteriores: '',
    
    // Vacinas
    vacinaCovid: false,
    vacinaGripe: false,
    vacinaHepatite: false,
    outrasVacinas: '',
    
    // Unidade
    unidadeAtendimento: 'Unidade Central'
  });

  const buscarPacientePorCPF = (e) => {
    e.preventDefault();
    
    // Simulação de busca - posteriormente será API
    const pacientesDB = [
      { 
        id: 1, 
        cpf: '123.456.789-00', 
        nome: 'Maria Silva',
        unidades: ['Unidade Norte'],
        historicoCompleto: true
      }
    ];

    const encontrado = pacientesDB.find(p => p.cpf === cpfBusca);
    
    if (encontrado) {
      setPacienteExistente(encontrado);
      setEtapa('vinculacao');
    } else {
      setFormData({ ...formData, cpf: cpfBusca });
      setEtapa('novo');
    }
  };

  const vincularUnidade = () => {
    console.log('Vinculando paciente', pacienteExistente, 'à unidade atual');
    navigate('/pacientes');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastrando novo paciente:', formData);
    navigate('/pacientes');
  };

  // Etapa 1: Busca por CPF
  if (etapa === 'busca') {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link
            to="/pacientes"
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
            ← Voltar para Pacientes
          </Link>
          
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#006F6A',
            marginBottom: '24px'
          }}>
            Cadastrar Paciente
          </h2>

          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#009688',
              marginBottom: '16px'
            }}>
              Buscar Paciente por CPF
            </h3>
            <p style={{ color: '#5A5A5A', marginBottom: '24px', lineHeight: '1.6' }}>
              Informe o CPF do paciente. Se já cadastrado em outra unidade, 
              vincularemos o prontuário existente.
            </p>

            <form onSubmit={buscarPacientePorCPF}>
              <input
                type="text"
                value={cpfBusca}
                onChange={(e) => setCpfBusca(e.target.value)}
                placeholder="000.000.000-00"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D9D9D9',
                  borderRadius: '4px',
                  fontSize: '16px',
                  marginBottom: '16px'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#009688',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Buscar Paciente
              </button>
            </form>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Etapa 2: Paciente Existente - Vincular Unidade
  if (etapa === 'vinculacao' && pacienteExistente) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link
            to="/pacientes"
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
            ← Voltar para Pacientes
          </Link>
          
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#006F6A',
            marginBottom: '24px'
          }}>
            Paciente Encontrado
          </h2>

          <div style={{
            backgroundColor: '#E6F9FF',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            borderLeft: '4px solid #009688'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#006F6A',
              marginBottom: '12px'
            }}>
              {pacienteExistente.nome}
            </h3>
            <p style={{ color: '#5A5A5A', marginBottom: '8px' }}>
              <strong>CPF:</strong> {pacienteExistente.cpf}
            </p>
            <p style={{ color: '#5A5A5A', marginBottom: '8px' }}>
              <strong>Unidades de Atendimento:</strong> {pacienteExistente.unidades.join(', ')}
            </p>
            <p style={{ color: '#009688', fontWeight: '600' }}>
              ✓ Prontuário completo disponível
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#5A5A5A', marginBottom: '24px', lineHeight: '1.6' }}>
              Este paciente já possui cadastro no sistema. Deseja vincular à sua unidade 
              para ter acesso ao histórico completo?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={vincularUnidade}
                style={{
                  flex: 1,
                  backgroundColor: '#009688',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Vincular à Minha Unidade
              </button>
              <button
                onClick={() => setEtapa('busca')}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#5A5A5A',
                  padding: '14px',
                  borderRadius: '4px',
                  border: '1px solid #D9D9D9',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Etapa 3: Novo Paciente - Formulário Completo
  return (
    <DashboardLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link
          to="/pacientes"
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
          ← Voltar para Pacientes
        </Link>
        
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#006F6A',
          marginBottom: '24px'
        }}>
          Novo Paciente - Prontuário Completo
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Dados Pessoais */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#009688',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '2px solid #E6F9FF'
            }}>
              Dados Pessoais
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                  Nome Completo *
                </label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                  CPF *
                </label>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                  Data de Nascimento *
                </label>
                <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                  Sexo *
                </label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }}>
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                  Telefone *
                </label>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                  Email
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          {/* Questionário de Saúde */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#009688',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '2px solid #E6F9FF'
            }}>
              Informações de Saúde
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                Tipo Sanguíneo
              </label>
              <select name="tipoSanguineo" value={formData.tipoSanguineo} onChange={handleChange}
                style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }}>
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { name: 'hipertenso', label: 'É hipertenso?' },
                { name: 'diabetico', label: 'É diabético?' },
                { name: 'fumante', label: 'É fumante?' },
                { name: 'medicamentoContinuo', label: 'Usa medicamento contínuo?' }
              ].map(({ name, label }) => (
                <label key={name} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#F5F6F7',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                  <span style={{ color: '#5A5A5A', fontWeight: '600' }}>{label}</span>
                </label>
              ))}
            </div>

            {formData.medicamentoContinuo && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                  Quais medicamentos usa continuamente?
                </label>
                <textarea name="medicamentosContinuos" value={formData.medicamentosContinuos} onChange={handleChange}
                  rows="3" style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }} />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                Alergias (medicamentos, alimentos, etc.)
              </label>
              <textarea name="alergias" value={formData.alergias} onChange={handleChange}
                rows="3" style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }}
                placeholder="Descreva as alergias conhecidas..." />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                Doenças Crônicas
              </label>
              <textarea name="doencasCronicas" value={formData.doencasCronicas} onChange={handleChange}
                rows="3" style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }}
                placeholder="Liste doenças crônicas..." />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                Cirurgias Anteriores
              </label>
              <textarea name="cirurgiasAnteriores" value={formData.cirurgiasAnteriores} onChange={handleChange}
                rows="3" style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }}
                placeholder="Descreva cirurgias realizadas e datas aproximadas..." />
            </div>
          </div>

          {/* Vacinas */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#009688',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '2px solid #E6F9FF'
            }}>
              Cartão de Vacinas
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              {[
                { name: 'vacinaCovid', label: 'COVID-19' },
                { name: 'vacinaGripe', label: 'Gripe (Influenza)' },
                { name: 'vacinaHepatite', label: 'Hepatite B' }
              ].map(({ name, label }) => (
                <label key={name} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#E6F9FF',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                  <span style={{ color: '#006F6A', fontWeight: '600' }}>{label}</span>
                </label>
              ))}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#5A5A5A', fontWeight: '600' }}>
                Outras Vacinas
              </label>
              <textarea name="outrasVacinas" value={formData.outrasVacinas} onChange={handleChange}
                rows="3" style={{ width: '100%', padding: '12px', border: '1px solid #D9D9D9', borderRadius: '4px' }}
                placeholder="Liste outras vacinas tomadas..." />
            </div>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: '#009688',
                color: 'white',
                padding: '16px',
                borderRadius: '4px',
                border: 'none',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cadastrar Paciente
            </button>
            <button
              type="button"
              onClick={() => navigate('/pacientes')}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: '#5A5A5A',
                padding: '16px',
                borderRadius: '4px',
                border: '1px solid #D9D9D9',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
