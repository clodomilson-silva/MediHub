import DashboardLayout from "../../layouts/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const pacientesIniciais = [
  { id: 1, nome: "Maria Silva", idade: 34, tipoSanguineo: "A+", cpf: "123.456.789-00", unidade: "Unidade Central" },
  { id: 2, nome: "João Santos", idade: 52, tipoSanguineo: "O-", cpf: "987.654.321-00", unidade: "Unidade Norte" },
  { id: 3, nome: "Ana Costa", idade: 28, tipoSanguineo: "B+", cpf: "456.789.123-00", unidade: "Unidade Central" },
];

export default function ListaPacientes() {
  const navigate = useNavigate();
  const [pacientes] = useState(pacientesIniciais);
  const [busca, setBusca] = useState("");

  const pacientesFiltrados = pacientes.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.cpf.includes(busca)
  );

  return (
    <DashboardLayout>
      <div>
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
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#006F6A'
          }}>
            Pacientes
          </h2>
          <button 
            onClick={() => navigate('/pacientes/novo')}
            style={{
              backgroundColor: '#009688',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            + Novo Paciente
          </button>
        </div>

        {/* Barra de Busca */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        {/* Lista de Pacientes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#006F6A', color: 'white' }}>
                <th style={{ padding: '16px', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>CPF</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Idade</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Tipo Sanguíneo</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Unidade</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.map((p) => (
                <tr 
                  key={p.id} 
                  style={{ 
                    borderBottom: '1px solid #F5F6F7',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6F9FF'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px', color: '#5A5A5A', fontWeight: '600' }}>{p.nome}</td>
                  <td style={{ padding: '16px', color: '#5A5A5A' }}>{p.cpf}</td>
                  <td style={{ padding: '16px', color: '#5A5A5A' }}>{p.idade} anos</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      backgroundColor: '#009688',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {p.tipoSanguineo}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#5A5A5A' }}>{p.unidade}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <Link 
                      to={`/paciente/${p.id}`}
                      style={{
                        backgroundColor: '#17C4C1',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pacientesFiltrados.length === 0 && (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#5A5A5A'
            }}>
              Nenhum paciente encontrado.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
