import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div>
        {/* Cards de Estatísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {[
            { titulo: 'Total de Pacientes', valor: '1,234', cor: '#009688' },
            { titulo: 'Consultas Hoje', valor: '45', cor: '#00A8A1' },
            { titulo: 'Exames Pendentes', valor: '12', cor: '#17C4C1' },
            { titulo: 'Procedimentos', valor: '8', cor: '#006F6A' }
          ].map((card, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${card.cor}`
              }}
            >
              <h3 style={{
                fontSize: '14px',
                color: '#5A5A5A',
                marginBottom: '8px'
              }}>
                {card.titulo}
              </h3>
              <p style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: card.cor
              }}>
                {card.valor}
              </p>
            </div>
          ))}
        </div>

        {/* Seção Principal */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#006F6A',
            marginBottom: '24px'
          }}>
            Bem-vindo ao MediHub
          </h2>
          <p style={{ color: '#5A5A5A', lineHeight: '1.6', marginBottom: '24px' }}>
            Gerencie pacientes, consultas, exames e procedimentos de forma integrada.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <button style={{
              backgroundColor: '#009688',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Novo Paciente
            </button>
            <button style={{
              backgroundColor: '#00A8A1',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Nova Consulta
            </button>
            <button style={{
              backgroundColor: '#17C4C1',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Novo Exame
            </button>
          </div>
        </div>

        {/* Atendimentos Recentes */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '24px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#006F6A',
            marginBottom: '16px'
          }}>
            Atendimentos Recentes
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F5F6F7' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#5A5A5A' }}>Paciente</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#5A5A5A' }}>Tipo</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#5A5A5A' }}>Data</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#5A5A5A' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { paciente: 'Maria Silva', tipo: 'Consulta', data: '09/12/2025', status: 'Concluído' },
                  { paciente: 'João Santos', tipo: 'Exame', data: '09/12/2025', status: 'Pendente' },
                  { paciente: 'Ana Costa', tipo: 'Procedimento', data: '08/12/2025', status: 'Concluído' }
                ].map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F5F6F7' }}>
                    <td style={{ padding: '12px', color: '#5A5A5A' }}>{item.paciente}</td>
                    <td style={{ padding: '12px', color: '#5A5A5A' }}>{item.tipo}</td>
                    <td style={{ padding: '12px', color: '#5A5A5A' }}>{item.data}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        backgroundColor: item.status === 'Concluído' ? '#009688' : '#00A8A1',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
