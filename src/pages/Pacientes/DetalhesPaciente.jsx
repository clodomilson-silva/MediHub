import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function DetalhesPaciente() {
  const { id } = useParams();

  // Simulação de dados - posteriormente virá de uma API
  const paciente = {
    id,
    nome: "Maria Silva",
    idade: 34,
    cpf: "123.456.789-00",
    tipoSanguineo: "A+",
    telefone: "(11) 98765-4321",
    email: "maria.silva@email.com",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    unidade: "Unidade Central"
  };

  const historico = [
    { id: 1, tipo: "Consulta", data: "12/04/2024", descricao: "Consulta de rotina - Hipertensão", medico: "Dr. João Santos" },
    { id: 2, tipo: "Exame", data: "10/02/2024", descricao: "Exame de sangue completo", medico: "Dra. Ana Costa" },
    { id: 3, tipo: "Emergência", data: "04/01/2024", descricao: "Atendimento emergencial", medico: "Dr. Carlos Lima" },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Cabeçalho */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <Link 
              to="/pacientes"
              style={{
                color: '#009688',
                textDecoration: 'none',
                fontSize: '14px',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              ← Voltar para Pacientes
            </Link>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#006F6A'
            }}>
              Paciente: {paciente.nome}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              backgroundColor: '#009688',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Editar
            </button>
            <button style={{
              backgroundColor: '#17C4C1',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Novo Atendimento
            </button>
          </div>
        </div>

        {/* Informações Pessoais */}
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
            Informações Pessoais
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <label style={{ display: 'block', color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>Nome Completo</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#006F6A' }}>{paciente.nome}</p>
            </div>
            <div>
              <label style={{ display: 'block', color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>CPF</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#006F6A' }}>{paciente.cpf}</p>
            </div>
            <div>
              <label style={{ display: 'block', color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>Idade</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#006F6A' }}>{paciente.idade} anos</p>
            </div>
            <div>
              <label style={{ display: 'block', color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>Tipo Sanguíneo</label>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                backgroundColor: '#009688',
                display: 'inline-block',
                padding: '4px 16px',
                borderRadius: '12px'
              }}>
                {paciente.tipoSanguineo}
              </p>
            </div>
            <div>
              <label style={{ display: 'block', color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>Telefone</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#006F6A' }}>{paciente.telefone}</p>
            </div>
            <div>
              <label style={{ display: 'block', color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>Email</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#006F6A' }}>{paciente.email}</p>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>Endereço</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#006F6A' }}>{paciente.endereco}</p>
            </div>
            <div>
              <label style={{ display: 'block', color: '#5A5A5A', fontSize: '14px', marginBottom: '4px' }}>Unidade de Atendimento</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#006F6A' }}>{paciente.unidade}</p>
            </div>
          </div>
        </div>

        {/* Histórico de Atendimentos */}
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
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #E6F9FF'
          }}>
            Histórico de Atendimentos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {historico.map((item) => (
              <div 
                key={item.id}
                style={{
                  padding: '20px',
                  backgroundColor: '#F5F6F7',
                  borderRadius: '8px',
                  borderLeft: '4px solid #009688'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <span style={{
                      backgroundColor: '#17C4C1',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>
                      {item.tipo}
                    </span>
                    <span style={{ color: '#5A5A5A', fontSize: '14px' }}>{item.data}</span>
                  </div>
                </div>
                <p style={{ color: '#006F6A', fontWeight: '600', marginBottom: '4px' }}>{item.descricao}</p>
                <p style={{ color: '#5A5A5A', fontSize: '14px' }}>Médico: {item.medico}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
